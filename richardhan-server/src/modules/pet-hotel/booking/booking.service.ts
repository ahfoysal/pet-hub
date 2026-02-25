import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, CancelledByEnum, Prisma } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { PlatformSettingsService } from 'src/modules/admin/platform-settings/platform-settings.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { RoomAvailabilityService } from '../room-availability/room-availability.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { HotelBookingsQueryDto } from './dto/hotel-bookings-query.dto';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availabilityService: RoomAvailabilityService,
    private readonly platformSettings: PlatformSettingsService
  ) {}

  async createBooking(userId: string, dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    const now = new Date();
    if (checkIn < now) {
      throw new BadRequestException('Check-in must be in the future');
    }

    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
      include: { hotelProfile: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const availability = await this.availabilityService.checkAvailability(
      dto.roomId,
      checkIn,
      checkOut
    );

    if (!availability.isAvailable) {
      throw new BadRequestException(
        `Room is not available for the selected dates. Available nights: ${availability.availableNights}/${availability.totalNights}`
      );
    }

    if (dto.petIds?.length) {
      const petOwner = await this.prisma.petOwnerProfile.findFirst({
        where: { userId },
        select: { id: true },
      });
      if (!petOwner) {
        throw new BadRequestException('Pet owner profile not found');
      }
      const userPetIds = await this.prisma.petProfile
        .findMany({
          where: { petOwnerId: petOwner.id, isDeleted: false },
          select: { id: true },
        })
        .then((p) => p.map((x) => x.id));
      const invalid = dto.petIds.filter((id) => !userPetIds.includes(id));
      if (invalid.length) {
        throw new BadRequestException(
          `Invalid or non-owned pet IDs: ${invalid.join(', ')}`
        );
      }
      if (dto.petIds.length > room.petCapacity) {
        throw new BadRequestException(
          `Room allows maximum ${room.petCapacity} pet(s)`
        );
      }
    }

    const availabilityRows =
      await this.availabilityService.getAvailabilityForRange(
        dto.roomId,
        checkIn,
        checkOut
      );
    const price = this.availabilityService.calculateTotalPrice(
      availabilityRows,
      room.price
    );

    const platformFeeAmount = (
      await this.platformSettings.getPlatformSettingsValues()
    ).platformFee;
    const platformFee = Math.round(platformFeeAmount);
    const grandTotal = price + platformFee;

    const booking = await this.prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          hotelProfileId: room.hotelProfileId,
          userId,
          roomId: dto.roomId,
          price,
          platformFee,
          grandTotal,
          checkInTime: checkIn,
          checkOutTime: checkOut,
          petIds: dto.petIds ?? [],
          assignedStuff: '',
          status: BookingStatus.PENDING,
          cancelledBy: CancelledByEnum.NOT_APPLICABLE,
          discount: dto.discount ?? '',
        },
        include: {
          room: {
            include: {
              hotelProfile: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      await this.availabilityService.lockDates(dto.roomId, checkIn, checkOut);
      return created;
    });

    return ApiResponse.success('Booking created successfully', {
      booking,
      breakdown: {
        roomPrice: price,
        platformFee,
        grandTotal,
        totalNights: availability.totalNights,
      },
    });
  }

  async getMyBookings(userId: string, page = 1, limit = 10) {
    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: { userId },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          room: {
            select: {
              id: true,
              roomNumber: true,
              images: true,
              roomType: true,
              price: true,
            },
          },
          hotelProfile: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.booking.count({ where: { userId } }),
    ]);

    return ApiResponse.success('Bookings fetched successfully', {
      bookings,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  }

  async getHotelBookings(hotelProfileId: string, query: HotelBookingsQueryDto) {
    const { search, status, page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const searchTerm = search?.trim();

    let matchingPetIds: string[] = [];
    if (searchTerm) {
      const pets = await this.prisma.petProfile.findMany({
        where: {
          petName: { contains: searchTerm, mode: 'insensitive' },
        },
        select: { id: true },
      });
      matchingPetIds = pets.map((p) => p.id);
    }

    const searchOrConditions: Prisma.BookingWhereInput[] = searchTerm
      ? [
          {
            user: {
              fullName: {
                contains: searchTerm,
                mode: 'insensitive' as const,
              },
            },
          },
          {
            room: {
              OR: [
                {
                  roomNumber: {
                    contains: searchTerm,
                    mode: 'insensitive' as const,
                  },
                },
                {
                  roomName: {
                    contains: searchTerm,
                    mode: 'insensitive' as const,
                  },
                },
              ],
            },
          },
          ...(matchingPetIds.length
            ? [{ petIds: { hasSome: matchingPetIds } }]
            : []),
        ]
      : [];

    const where: Prisma.BookingWhereInput = {
      hotelProfileId,
      ...(status && { status }),
      ...(searchOrConditions.length > 0 && { OR: searchOrConditions }),
    };

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            },
          },
          room: {
            select: {
              id: true,
              roomNumber: true,
              roomName: true,
              roomType: true,
              price: true,
              images: true,
            },
          },
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    const allPetIds = [...new Set(bookings.flatMap((b) => b.petIds))];
    const petProfiles =
      allPetIds.length > 0
        ? await this.prisma.petProfile.findMany({
            where: { id: { in: allPetIds } },
            select: {
              id: true,
              petName: true,
              profileImg: true,
              petType: true,
              breed: true,
            },
          })
        : [];
    const petMap = new Map(petProfiles.map((p) => [p.id, p]));

    const bookingsWithPets = bookings.map((b) => ({
      ...b,
      pets: b.petIds.map((id) => petMap.get(id)).filter(Boolean) as {
        id: string;
        petName: string;
      }[],
    }));

    return ApiResponse.success('Hotel bookings fetched successfully', {
      bookings: bookingsWithPets,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  }

  async getById(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: {
          include: {
            hotelProfile: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                images: true,
              },
            },
          },
        },
        hotelProfile: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            userId: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const hotelUserId = booking.hotelProfile?.userId;

    if (booking.userId !== userId && hotelUserId !== userId) {
      throw new ForbiddenException('You do not have access to this booking');
    }

    return ApiResponse.success('Booking found', booking);
  }

  async cancelBooking(
    bookingId: string,
    userId: string,
    cancelledBy: CancelledByEnum
  ) {
    if (cancelledBy === CancelledByEnum.NOT_APPLICABLE) {
      throw new BadRequestException('Invalid cancelledBy for cancellation');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: true,
        hotelProfile: { select: { userId: true } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const isPetOwner = booking.userId === userId;
    const isHotelOwner = booking.hotelProfile?.userId === userId;

    if (cancelledBy === CancelledByEnum.PET_OWNER && !isPetOwner) {
      throw new ForbiddenException('Only the guest can cancel as pet owner');
    }
    if (cancelledBy === CancelledByEnum.HOTEL_OWNER && !isHotelOwner) {
      throw new ForbiddenException('Only the hotel can cancel as hotel owner');
    }
    if (!isPetOwner && !isHotelOwner) {
      throw new ForbiddenException('You do not have access to this booking');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    await this.prisma.$transaction(async () => {
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          cancelledBy,
        },
      });
      await this.availabilityService.unlockDates(
        booking.roomId,
        booking.checkInTime,
        booking.checkOutTime
      );
    });

    return ApiResponse.success('Booking cancelled successfully');
  }
}
