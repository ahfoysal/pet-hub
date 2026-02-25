import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreatePetSitterBookingDto,
  RequestToCompleteDto,
} from './dto/pet-sitter-booking.dto';

import { PetSitterBookingTypeEnum } from 'src/common/constants/enums';
import {
  BookingType,
  PetSitterBookingStatus,
  PetSitterStatus,
  Prisma,
} from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { PlatformSettingsService } from 'src/modules/admin/platform-settings/platform-settings.service';
import { generateUniqueId } from 'src/common/utils/generateUniqueIds';

@Injectable()
export class PetSitterBookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly platformSettings: PlatformSettingsService
  ) {}

  async createBooking(userId: string, dto: CreatePetSitterBookingDto) {
    // 1️⃣ Validate booking type
    if (dto.serviceId && dto.packageId)
      throw new BadRequestException(
        'You cannot book both service and package.'
      );
    if (!dto.serviceId && !dto.packageId)
      throw new BadRequestException('Service or package is required.');

    // 2️⃣ Fetch user and pet owner in parallel
    const [user, petOwner] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.petOwnerProfile.findUnique({
        where: { userId },
        include: { petOwnerAddresses: true, petProfiles: true },
      }),
    ]);

    if (!user || user.status !== 'ACTIVE')
      throw new NotFoundException('User not found or inactive');
    if (!petOwner) throw new NotFoundException('Pet owner not found');

    // 3️⃣ Validate pet IDs
    const ownerPetIds = petOwner.petProfiles?.map((p) => p.id) || [];
    const invalidPetIds = dto.petIds.filter((id) => !ownerPetIds.includes(id));
    if (invalidPetIds.length)
      throw new BadRequestException('Some pet IDs are invalid for this owner');

    // 4️⃣ Determine service/package and totals
    let petSitterProfileId: string;
    let totalAmount = 0;
    let durationInMinutes = 0;
    let packageServices: string[] = [];
    let additionalServiceIds: string[] = [];

    if (dto.bookingType === PetSitterBookingTypeEnum.SERVICE) {
      const service = await this.prisma.service.findUnique({
        where: { id: dto.serviceId },
      });
      if (!service || !service.isAvailable)
        throw new NotFoundException('Service not found or unavailable');

      petSitterProfileId = service.petSitterId;
      totalAmount = Number(service.price);
      durationInMinutes = service.durationInMinutes;
    } else {
      const pkg = await this.prisma.package.findUnique({
        where: { id: dto.packageId },
        include: { packageServices: { select: { serviceId: true } } },
      });
      if (!pkg) throw new NotFoundException('Package not found');

      petSitterProfileId = pkg.petSitterId;
      totalAmount = Number(pkg.calculatedPrice);
      durationInMinutes = pkg.durationInMinutes;
      packageServices = pkg.packageServices.map((s) => s.serviceId);

      // Handle additional services safely
      if (dto.additionalServices?.length) {
        if (dto.additionalServices.length > 3)
          throw new BadRequestException(
            'You can add a maximum of 3 additional services'
          );

        // Remove duplicates
        const uniqueAdditionalIds = Array.from(new Set(dto.additionalServices));

        // 1️⃣ Fetch services that exist
        const existingServices = await this.prisma.service.findMany({
          where: { id: { in: uniqueAdditionalIds } },
        });

        // 2️⃣ Check for non-existent services
        const missingIds = uniqueAdditionalIds.filter(
          (id) => !existingServices.find((s) => s.id === id)
        );
        if (missingIds.length) {
          throw new BadRequestException(
            `Some additional services do not exist: ${missingIds.join(', ')}`
          );
        }

        // 3️⃣ Check availability and pet sitter match
        const unavailableOrWrongSitter = existingServices.filter(
          (s) => !s.isAvailable || s.petSitterId !== petSitterProfileId
        );
        if (unavailableOrWrongSitter.length) {
          throw new BadRequestException(
            `Some additional services are unavailable or belong to another pet sitter: ${unavailableOrWrongSitter
              .map((s) => s.id)
              .join(', ')}`
          );
        }

        // 4️⃣ Check for overlap with package services
        const overlapping = existingServices.filter((s) =>
          packageServices.includes(s.id)
        );
        if (overlapping.length) {
          throw new BadRequestException(
            `Some additional services are already included in the package: ${overlapping
              .map((s) => s.id)
              .join(', ')}`
          );
        }

        additionalServiceIds = existingServices.map((s) => s.id);

        // 5️⃣ Add to totals
        totalAmount += existingServices.reduce(
          (sum, s) => sum + Number(s.price),
          0
        );
        durationInMinutes += existingServices.reduce(
          (sum, s) => sum + s.durationInMinutes,
          0
        );
      }
    }

    // 5️⃣ Fetch pet sitter profile
    const petSitterProfile = await this.prisma.petSitterProfile.findUnique({
      where: { id: petSitterProfileId },
      include: { petSitterAddresses: true },
    });
    if (!petSitterProfile || petSitterProfile.profileStatus !== 'ACTIVE')
      throw new NotFoundException('Pet sitter profile not found or inactive');
    if (petSitterProfile.status === PetSitterStatus.ON_VACATION)
      throw new BadRequestException(
        'Pet sitter is on vacation and cannot accept bookings'
      );

    // 6️⃣ Compute booking times
    const startingTime = new Date(dto.bookingTime);
    if (startingTime <= new Date())
      throw new BadRequestException('Booking time must be in the future');
    const finishingTime = new Date(startingTime);
    finishingTime.setMinutes(finishingTime.getMinutes() + durationInMinutes);

    // 7️⃣ Resolve location
    let location: string;
    if (dto.isOwnHome) {
      const addr = petOwner.petOwnerAddresses?.[0];
      if (!addr) throw new BadRequestException('Pet owner address not found');
      location = [addr.streetAddress, addr.city, addr.country, addr.postalCode]
        .filter(Boolean)
        .join(', ');
    } else {
      const addr = petSitterProfile.petSitterAddresses?.[0];
      if (!addr) throw new BadRequestException('Pet sitter address not found');
      location = [addr.streetAddress, addr.city, addr.country]
        .filter(Boolean)
        .join(', ');
    }

    // 8️⃣ Platform fee
    // Assuming PLATFORM_FEE is a percentage like 10 for 10%
    const PLATFORM_FEE_PERCENT = (
      await this.platformSettings.getPlatformSettingsValues()
    ).platformFee;

    // Calculate the platform fee as a portion of totalAmount
    const platformFeeAmount = (totalAmount * PLATFORM_FEE_PERCENT) / 100;

    // Add it to the total to get grand total
    const grandTotal = totalAmount + platformFeeAmount;

    // 9️⃣ Create booking in transaction with overlap check and unique bookingId
    const booking = await this.prisma.$transaction(async (tx) => {
      const overlap = await tx.petSitterBooking.findFirst({
        where: {
          petSitterProfileId,
          status: {
            in: [
              PetSitterBookingStatus.CONFIRMED,
              PetSitterBookingStatus.IN_PROGRESS,
              PetSitterBookingStatus.REQUEST_TO_COMPLETE,
              PetSitterBookingStatus.LATE,
            ],
          },
          AND: [
            { startingTime: { lt: finishingTime } },
            { finishingTime: { gt: startingTime } },
          ],
        },
      });
      if (overlap)
        throw new BadRequestException(
          'The pet sitter is already booked for this time'
        );

      // --- Generate unique bookingId ---
      let bookingId: string;
      const MAX_RETRIES = 5;
      let retries = 0;

      while (retries < MAX_RETRIES) {
        try {
          bookingId = generateUniqueId('B');

          const createdBooking = await tx.petSitterBooking.create({
            data: {
              bookingId,
              clientId: userId,
              petSitterProfileId,
              bookingType: dto.bookingType,
              price: totalAmount,
              platformFee: platformFeeAmount,
              grandTotal,
              status: PetSitterBookingStatus.PENDING,

              startingTime,
              finishingTime,
              packageId: dto.packageId || null,
              serviceId: dto.serviceId || null,
              isOwnHome: dto.isOwnHome,
              specialInstructions: dto.specialInstructions,
              durationInMinutes,
              location,
              pets: { create: dto.petIds.map((petId) => ({ petId })) },
            },
          });

          if (additionalServiceIds.length) {
            await tx.petSitterBookingAdditionalService.createMany({
              data: additionalServiceIds.map((id) => ({
                petSitterBookingId: createdBooking.id,
                additionalServiceId: id,
              })),
            });
          }

          return createdBooking;
        } catch (err: any) {
          if (err.code === 'P2002') {
            retries++;
            continue; // try generating a new ID
          }
          throw err;
        }
      }

      throw new Error(
        'Failed to generate unique booking ID after multiple attempts'
      );
    });

    return ApiResponse.success('Booking created', {
      id: booking.id,
      bookingType: booking.bookingType,
      status: booking.status,
      startingTime: booking.startingTime,
      finishingTime: booking.finishingTime,
      price: booking.price,
      grandTotal: booking.grandTotal,
      platformFee: booking.platformFee,
      isOwnHome: booking.isOwnHome,
      location: booking.location,
      petIds: dto.petIds,
      additionalServiceIds,
      petSitterId: booking.petSitterProfileId,
      bookingId: booking.bookingId,
    });
  }

  async getMyBookingsAsPetOwner(
    userId: string,
    cursor?: string,
    limit = 20,
    filter?: {
      status?: PetSitterBookingStatus;
      bookingType?: PetSitterBookingTypeEnum;
      from?: Date;
      to?: Date;
    },
    search?: string
  ) {
    limit = Math.min(limit, 50);

    // 1️⃣ Validate pet owner
    const petOwner = await this.prisma.petOwnerProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!petOwner || petOwner.user.status !== 'ACTIVE') {
      throw new NotFoundException('Pet owner not found');
    }

    // 2️⃣ Build filters
    const where: Prisma.PetSitterBookingWhereInput = { clientId: userId };

    if (filter?.status) where.status = filter.status;
    if (filter?.bookingType) where.bookingType = filter.bookingType;
    if (filter?.from && filter?.to)
      where.startingTime = { gte: filter.from, lte: filter.to };

    if (search) {
      where.OR = [
        {
          service: { name: { contains: search, mode: 'insensitive' } },
          package: { name: { contains: search, mode: 'insensitive' } },
          petSitter: {
            user: { fullName: { contains: search, mode: 'insensitive' } },
          },
        },
      ];
    }

    // 3️⃣ Fetch bookings
    const bookings = await this.prisma.petSitterBooking.findMany({
      where,
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1,
      orderBy: { createdAt: 'desc' },
      include: {
        pets: { include: { pet: true } },
        petSitter: { include: { user: true, petSitterAddresses: true } },
        cancelledByUser: {
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },
        service: true,
        package: {
          include: {
            packageServices: { include: { service: true } },
          },
        },
      },
    });

    // 4️⃣ Compute average ratings (same as before)
    const petSitterIds = bookings.map((b) => b.petSitterProfileId);

    const serviceRatings = await this.prisma.serviceReview.groupBy({
      by: ['serviceId'],
      _avg: { rating: true },
    });
    const serviceRatingMap: Record<string, number> = {};
    serviceRatings.forEach((r) => {
      if (r._avg.rating !== null) serviceRatingMap[r.serviceId] = r._avg.rating;
    });

    const petSitterRatings: Record<string, number | null> = {};
    petSitterIds.forEach((id) => {
      const serviceIds = bookings
        .filter((b) => b.petSitterProfileId === id && b.serviceId)
        .map((b) => b.serviceId!)
        .filter((sid) => serviceRatingMap[sid] !== undefined);

      if (serviceIds.length === 0) {
        petSitterRatings[id] = null;
      } else {
        const sum = serviceIds.reduce(
          (acc, sid) => acc + serviceRatingMap[sid],
          0
        );
        petSitterRatings[id] = sum / serviceIds.length;
      }
    });

    // 5️⃣ Map booking data including cancel info
    const bookingData = bookings.map((b) => ({
      id: b.id,
      bookingType: b.bookingType,
      price: b.price,
      bookingId: b.bookingId,
      grandTotal: b.grandTotal,
      platformFee: b.platformFee,
      bookingStatus: b.status,
      image:
        b.bookingType === 'PACKAGE'
          ? b.package?.image
          : b.service?.thumbnailImage,
      petSitter: {
        averageRating: petSitterRatings[b.petSitterProfileId] ?? null,
        name: b.petSitter.user.fullName,
        image: b.petSitter.user.image,
        id: b.petSitter.id,
      },
      location: b.location,
      servicesInPackage:
        b.bookingType === 'PACKAGE'
          ? (b.package?.packageServices?.map((ps) => ({
              serviceName: ps.service.name,
            })) ?? [])
          : [],

      cancelInfo:
        b.status === 'CANCELLED'
          ? {
              cancelledByUserId: b.cancelledByUser?.id ?? null,
              cancelledByName: b.cancelledByUser?.fullName ?? null,
              cancelledByRole: b.cancelledByRole ?? null,
              cancelledAt: b.cancelledAt ?? null,
            }
          : null,
    }));

    // 6️⃣ Pagination cursor
    const nextCursor = bookings.length > limit ? bookings[limit].id : null;

    return ApiResponse.success('Bookings fetched successfully', {
      data: bookingData.slice(0, limit),
      nextCursor,
    });
  }

  async getBookingDetails(bookingId: string) {
    const booking = await this.prisma.petSitterBooking.findUnique({
      where: { id: bookingId },
      select: {
        id: true, // Booking ID for navigation
        bookingType: true,
        startingTime: true,
        finishingTime: true,
        durationInMinutes: true,
        location: true,
        isOwnHome: true,
        status: true,

        price: true,
        platformFee: true,
        grandTotal: true,
        bookingId: true,
        specialInstructions: true,

        completionNote: true,
        completionProof: true,
        completedAt: true,
        requestCompletedAt: true,

        cancelledByRole: true,
        cancelledAt: true,

        pets: {
          select: {
            pet: {
              select: {
                id: true, // Pet ID
                petName: true,
                profileImg: true,
                age: true,
              },
            },
          },
        },

        petSitter: {
          select: {
            id: true, // PetSitterProfile ID
            user: {
              select: {
                id: true, // User ID
                fullName: true,
                image: true,
              },
            },
          },
        },

        cancelledByUser: {
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },

        service: {
          select: {
            id: true,
            name: true,
            thumbnailImage: true,
          },
        },

        package: {
          select: {
            id: true,
            name: true,
            image: true, // Added image: true here
            packageServices: {
              select: {
                service: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },

        petSitterBookingAdditionalServices: {
          select: {
            additionalService: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const pets = booking.pets.map((p) => ({
      petId: p.pet.id,
      name: p.pet.petName,
      image: p.pet.profileImg,
      age: p.pet.age,
    }));

    const includedServices =
      booking.bookingType === BookingType.PACKAGE && booking.package
        ? booking.package.packageServices.map((ps) => ({
            serviceId: ps.service.id,
            name: ps.service.name,
          }))
        : [];

    const additionalServices = booking.petSitterBookingAdditionalServices.map(
      (ps) => ({
        serviceId: ps.additionalService.id,
        name: ps.additionalService.name,
      })
    );

    const cancelInfo =
      booking.status === PetSitterBookingStatus.CANCELLED
        ? {
            cancelledByUserId: booking.cancelledByUser?.id ?? null,
            cancelledByName: booking.cancelledByUser?.fullName ?? null,
            cancelledByRole: booking.cancelledByRole ?? null,
            cancelledAt: booking.cancelledAt ?? null,
          }
        : null;

    const COMPLETION_STATUSES = new Set<PetSitterBookingStatus>([
      PetSitterBookingStatus.REQUEST_TO_COMPLETE,
      PetSitterBookingStatus.COMPLETED,
    ]);

    const completionInfo = COMPLETION_STATUSES.has(booking.status)
      ? {
          completionNote: booking.completionNote ?? null,
          completionProof: booking.completionProof ?? [],
          completedAt: booking.completedAt ?? null,
          requestCompletedAt: booking.requestCompletedAt ?? null,
        }
      : null;

    return ApiResponse.success('Booking details fetched successfully', {
      id: booking.id,

      name:
        booking.bookingType === BookingType.PACKAGE
          ? booking.package?.name
          : booking.service?.name,

      image:
        booking.bookingType === BookingType.PACKAGE
          ? booking.package?.image
          : booking.service?.thumbnailImage,

      bookingType: booking.bookingType,
      status: booking.status,

      startTime: booking.startingTime,
      endTime: booking.finishingTime,
      durationInMinutes: booking.durationInMinutes,

      location: booking.location,
      isOwnHome: booking.isOwnHome,

      petSitter: {
        id: booking.petSitter.id,
        userId: booking.petSitter.user.id,
        name: booking.petSitter.user.fullName,
        image: booking.petSitter.user.image,
      },

      pets,
      includedServices,
      additionalServices,
      bookingId: booking.bookingId,
      price: booking.price,
      platformFee: booking.platformFee,
      grandTotal: booking.grandTotal,

      specialInstructions: booking.specialInstructions,

      cancelInfo,
      completionInfo,
    });
  }

  async getMyBookingsAsPetSitter(
    userId: string,
    cursor?: string,
    limit = 20,
    filter?: {
      status?: PetSitterBookingStatus;
      bookingType?: PetSitterBookingTypeEnum;
      from?: Date;
      to?: Date;
    },
    search?: string
  ) {
    limit = Math.min(limit, 50);

    // 1️⃣ Validate pet sitter
    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!petSitter || petSitter.user.status !== 'ACTIVE') {
      throw new NotFoundException('Pet sitter not found');
    }

    // 2️⃣ Build filters
    const where: Prisma.PetSitterBookingWhereInput = {
      petSitterProfileId: petSitter.id,
    };

    if (filter?.status) where.status = filter.status;
    if (filter?.bookingType) where.bookingType = filter.bookingType;
    if (filter?.from && filter?.to)
      where.startingTime = { gte: filter.from, lte: filter.to };

    if (search) {
      where.OR = [
        {
          service: { name: { contains: search, mode: 'insensitive' } },
          package: { name: { contains: search, mode: 'insensitive' } },
          user: { fullName: { contains: search, mode: 'insensitive' } }, // pet owner
        },
      ];
    }

    // 3️⃣ Fetch bookings
    const bookings = await this.prisma.petSitterBooking.findMany({
      where,
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1,
      orderBy: { createdAt: 'desc' },
      include: {
        pets: { include: { pet: true } },
        user: { select: { id: true, fullName: true, image: true } }, // pet owner - Added image: true
        service: true,
        package: {
          include: {
            packageServices: { include: { service: true } },
          },
        },
        cancelledByUser: {
          // include cancel info
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },
      },
    });

    // 4️⃣ Map booking data including cancel info
    const bookingData = bookings.map((b) => ({
      id: b.id,
      bookingType: b.bookingType,
      price: b.price,
      grandTotal: b.grandTotal,
      platformFee: b.platformFee,
      image:
        b.bookingType === 'PACKAGE'
          ? b.package?.image
          : b.service?.thumbnailImage,
      petOwnerName: b.user.fullName,
      status: b.status,
      bookingId: b.bookingId,
      pets: b.pets.map((p) => ({
        name: p.pet.petName,
        image: p.pet.profileImg,
        age: p.pet.age,
      })),
      servicesInPackage:
        b.bookingType === 'PACKAGE'
          ? (b.package?.packageServices.map((ps) => ps.service.name) ?? [])
          : [],

      bookingStatus: b.status,
      dateTime: b.startingTime,
      cancelInfo:
        b.status === 'CANCELLED'
          ? {
              cancelledByUserId: b.cancelledByUser?.id ?? null,
              cancelledByName: b.cancelledByUser?.fullName ?? null,
              cancelledByRole: b.cancelledByRole ?? null,
              cancelledAt: b.cancelledAt ?? null,
            }
          : null,
    }));

    // 5️⃣ Pagination
    const nextCursor = bookings.length > limit ? bookings[limit].id : null;

    return ApiResponse.success('Bookings fetched successfully', {
      data: bookingData.slice(0, limit),
      nextCursor,
    });
  }

  async cancelBooking(bookingId: string, userId: string) {
    // 1️⃣ Validate active user
    const user = await this.prisma.user.findFirst({
      where: { id: userId, status: 'ACTIVE' },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2️⃣ Resolve pet sitter profile if applicable
    let petSitterProfileId: string | undefined;

    if (user.role === 'PET_SITTER') {
      const petSitter = await this.prisma.petSitterProfile.findFirst({
        where: { userId },
        select: { id: true },
      });

      if (!petSitter) {
        throw new NotFoundException('Pet sitter not found');
      }

      petSitterProfileId = petSitter.id;
    }

    // 3️⃣ Build safe OR conditions (no nulls)
    const orConditions: Prisma.PetSitterBookingWhereInput[] = [
      { clientId: userId }, // pet owner
    ];

    if (petSitterProfileId) {
      orConditions.push({ petSitterProfileId }); // pet sitter
    }

    // 4️⃣ Atomic cancel (PENDING only) and track who cancelled
    const result = await this.prisma.petSitterBooking.updateMany({
      where: {
        id: bookingId,
        status: 'PENDING',
        OR: orConditions,
      },
      data: {
        status: 'CANCELLED',
        cancelledByUserId: userId,
        cancelledByRole: user.role, // assumes enum type in Prisma
        cancelledAt: new Date(),
      },
    });

    if (result.count === 0) {
      throw new BadRequestException(
        'Booking not found, already processed, or you are not allowed to cancel it'
      );
    }

    return ApiResponse.success('Booking cancelled successfully');
  }

  // MARK AS IN PROGRESS and set status to IN_PROGRESS, only single inprogress allowed
  async markAsInProgress(bookingId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Validate pet sitter
      const petSitter = await tx.petSitterProfile.findFirst({
        where: {
          userId,
          user: { status: 'ACTIVE' },
          profileStatus: 'ACTIVE',
        },
        select: { id: true },
      });

      if (!petSitter) {
        throw new NotFoundException('Pet sitter not found');
      }

      // 2️⃣ Block parallel active services
      const activeBooking = await tx.petSitterBooking.findFirst({
        where: {
          petSitterProfileId: petSitter.id,
          status: 'IN_PROGRESS',
        },
        select: { id: true },
      });

      if (activeBooking) {
        throw new BadRequestException('You already have a booking in progress');
      }

      // 3️⃣ Fetch booking
      const booking = await tx.petSitterBooking.findUnique({
        where: { id: bookingId },
        select: { status: true, isLate: true, startingTime: true },
      });

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      if (booking.status !== 'CONFIRMED') {
        throw new BadRequestException(
          'Booking is not confirmed and cannot be started'
        );
      }

      const GRACE_PERIOD_MINUTES = 10;

      const now = new Date();

      const allowedStartTime = new Date(
        booking.startingTime.getTime() - GRACE_PERIOD_MINUTES * 60 * 1000
      );

      if (now < allowedStartTime) {
        throw new BadRequestException(
          `You can only start this booking within ${GRACE_PERIOD_MINUTES} minutes of the scheduled time`
        );
      }

      // 4️⃣ Prepare update data
      const updateData: Prisma.PetSitterBookingUpdateInput = {
        status: 'IN_PROGRESS',
      };

      // Only calculate minuteLate if the booking was already late
      if (booking.isLate) {
        const diffMs = now.getTime() - booking.startingTime.getTime();
        updateData.minutesLate = Math.floor(diffMs / 1000 / 60); // minutes
      }

      // 5️⃣ Update booking
      await tx.petSitterBooking.update({
        where: { id: bookingId },
        data: updateData,
      });

      // 6️⃣ Update sitter availability state
      await tx.petSitterProfile.update({
        where: { id: petSitter.id },
        data: { status: 'ON_SERVICE' },
      });

      return ApiResponse.success('Booking marked as in progress');
    });
  }

  async requestToComplete(
    bookingId: string,
    userId: string,
    payload: RequestToCompleteDto,
    files?: Express.Multer.File[]
  ) {
    // ✅ 0. Validate files
    if (!files?.length) {
      throw new BadRequestException(
        'No files provided for upload, completion proof is required'
      );
    }

    // ✅ 1. Upload files to Cloudinary
    const fileUrls = await this.cloudinary.uploadMultipleFiles(files);
    const urls = fileUrls.map((file) => file.secure_url);

    const now = new Date();

    // ✅ 2. Validate pet sitter
    const petSitter = await this.prisma.petSitterProfile.findFirst({
      where: {
        userId,
        user: { status: 'ACTIVE' },
        profileStatus: 'ACTIVE',
      },
      select: { id: true },
    });

    if (!petSitter) {
      throw new NotFoundException('Pet sitter not found');
    }

    // ✅ 3. Atomic status transition: IN_PROGRESS → REQUEST_TO_COMPLETE
    const result = await this.prisma.petSitterBooking.updateMany({
      where: {
        id: bookingId,
        petSitterProfileId: petSitter.id,
        status: 'IN_PROGRESS', // only allowed from IN_PROGRESS
      },
      data: {
        status: 'REQUEST_TO_COMPLETE',
        requestCompletedAt: now,
        completionNote: payload.completionNote ?? '',
        completionProof: { set: urls },
      },
    });

    if (result.count === 0) {
      throw new BadRequestException(
        'Booking not found, not in progress, or you are not allowed to request completion'
      );
    }

    // ✅ 4. Return standardized API response
    return ApiResponse.success('Booking marked as request to complete');
  }

  async confirmBooking(bookingId: string, userId: string) {
    // 1️⃣ Validate pet sitter
    const petSitter = await this.prisma.petSitterProfile.findFirst({
      where: { userId, user: { status: 'ACTIVE' }, profileStatus: 'ACTIVE' },
      select: { id: true, status: true },
    });

    if (!petSitter)
      throw new NotFoundException(
        'You do not have an active pet sitter profile'
      );

    if (petSitter.status === PetSitterStatus.ON_VACATION) {
      throw new BadRequestException(
        'You are currently on vacation and cannot confirm any bookings'
      );
    }

    // 2️⃣ Fetch booking
    const booking = await this.prisma.petSitterBooking.findFirst({
      where: { id: bookingId, petSitterProfileId: petSitter.id },
      select: {
        id: true,
        startingTime: true,
        finishingTime: true,
        status: true,
      },
    });

    if (!booking) {
      throw new BadRequestException(
        'This booking does not exist or you are not allowed to confirm it'
      );
    }

    // 3️⃣ Check invalid statuses
    const invalidStatuses: PetSitterBookingStatus[] = [
      PetSitterBookingStatus.CONFIRMED,
      PetSitterBookingStatus.IN_PROGRESS,
      PetSitterBookingStatus.CANCELLED,
      PetSitterBookingStatus.REQUEST_TO_COMPLETE,
      PetSitterBookingStatus.COMPLETED,
      PetSitterBookingStatus.EXPIRED,
    ];

    if (invalidStatuses.includes(booking.status)) {
      throw new BadRequestException(
        `This booking cannot be confirmed: ${booking.status}`
      );
    }

    // 4️⃣ Attempt atomic confirmation
    const updated = await this.prisma.petSitterBooking.updateMany({
      where: {
        id: booking.id,
        status: PetSitterBookingStatus.PENDING,
        NOT: {
          petSitter: {
            petSitterBookings: {
              some: {
                id: { not: booking.id },
                status: {
                  in: [
                    PetSitterBookingStatus.CONFIRMED,
                    PetSitterBookingStatus.IN_PROGRESS,
                  ],
                },
                startingTime: { lt: booking.finishingTime! },
                finishingTime: { gt: booking.startingTime },
              },
            },
          },
        },
      },
      data: { status: PetSitterBookingStatus.CONFIRMED },
    });

    if (updated.count === 0) {
      throw new BadRequestException(
        'Cannot confirm booking: overlapping confirmed/in-progress booking exists'
      );
    }

    return ApiResponse.success('You have successfully confirmed this booking');
  }

  async completeBooking(bookingId: string, userId: string) {
    // 1️⃣ Validate active pet owner
    const user = await this.prisma.user.findFirst({
      where: { id: userId, status: 'ACTIVE', role: 'PET_OWNER' },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found or not allowed');
    }

    // 2️⃣ Read booking & sitter OUTSIDE transaction
    const booking = await this.prisma.petSitterBooking.findFirst({
      where: {
        id: bookingId,
        clientId: userId,
        status: 'REQUEST_TO_COMPLETE',
      },
      select: {
        id: true,
        petSitterProfileId: true,
      },
    });

    if (!booking) {
      throw new BadRequestException(
        'Booking not found, not requested for completion, or not allowed'
      );
    }

    // 3️⃣ Atomic transition
    await this.prisma.$transaction(async (tx) => {
      // ✅ Complete booking
      await tx.petSitterBooking.update({
        where: { id: booking.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      // ✅ Always move sitter back to OFF_SERVICE
      await tx.petSitterProfile.update({
        where: { id: booking.petSitterProfileId },
        data: { status: 'OFF_SERVICE' },
      });
    });

    return ApiResponse.success('Booking completed successfully');
  }

  async getMyPetsBookingHistoryByPetId(
    userId: string,
    petId: string,
    cursor?: string,
    limit = 20,
    search?: string
  ) {
    // 1️⃣ Validate pet owner
    const petOwner = await this.prisma.petOwnerProfile.findFirst({
      where: { userId, user: { status: 'ACTIVE' } },
      select: { id: true },
    });
    if (!petOwner) throw new NotFoundException('Pet owner not found');

    // 2️⃣ Validate pet
    const pet = await this.prisma.petProfile.findFirst({
      where: { id: petId, isDeleted: false, petOwnerId: petOwner.id },
      select: { id: true, petName: true },
    });
    if (!pet) throw new NotFoundException('Pet not found');

    // 3️⃣ Fetch bookings
    const bookings = await this.prisma.petSitterBooking.findMany({
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      where: {
        pets: { some: { petId: pet.id } },
        ...(search && {
          OR: [
            { service: { name: { contains: search, mode: 'insensitive' } } },
            { package: { name: { contains: search, mode: 'insensitive' } } },
          ],
        }),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        pets: {
          select: {
            pet: { select: { id: true, petName: true, petType: true } },
          },
        },
        petSitter: {
          select: {
            id: true,
            bio: true,
            yearsOfExperience: true,
            user: { select: { id: true, fullName: true, image: true } }, // Added image: true
          },
        },
        service: { select: { id: true, name: true } },
        package: { select: { id: true, name: true } },
        cancelledByUser: { select: { id: true, fullName: true, image: true } },
        bookingId: true,
        id: true,
        status: true,
        price: true,
        grandTotal: true,
        startingTime: true,
        finishingTime: true,
        location: true,
        isOwnHome: true,
      },
    });

    const hasNextPage = bookings.length > limit;
    const items = hasNextPage ? bookings.slice(0, limit) : bookings;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return ApiResponse.success('Bookings found', {
      items,
      nextCursor,
      hasNextPage,
    });
  }
}
