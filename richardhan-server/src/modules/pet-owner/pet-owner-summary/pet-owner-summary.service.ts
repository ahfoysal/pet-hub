import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PetSitterBookingStatus, Prisma } from '@prisma/client';

@Injectable()
export class PetOwnerSummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getBookingSummary(userId: string) {
    const petOwner = await this.prisma.petOwnerProfile.findFirst({
      where: {
        userId,
        user: { status: 'ACTIVE' },
      },
      select: { id: true },
    });

    if (!petOwner) {
      throw new NotFoundException('Pet owner not found');
    }

    const grouped = await this.prisma.petSitterBooking.groupBy({
      by: ['status'],
      where: { clientId: userId },
      _count: { status: true },
    });

    // 3️⃣ Convert to map for easier access
    const breakdown: Record<PetSitterBookingStatus, number> = Object.values(
      PetSitterBookingStatus
    ).reduce(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {} as Record<PetSitterBookingStatus, number>
    );

    grouped.forEach(({ status, _count }) => {
      breakdown[status] = _count.status;
    });

    const activeStatuses: PetSitterBookingStatus[] = [
      PetSitterBookingStatus.PENDING,
      PetSitterBookingStatus.CONFIRMED,
      PetSitterBookingStatus.IN_PROGRESS,
      PetSitterBookingStatus.REQUEST_TO_COMPLETE,
    ];

    const failedStatuses: PetSitterBookingStatus[] = [
      PetSitterBookingStatus.CANCELLED,
      PetSitterBookingStatus.EXPIRED,
    ];

    const activeBookings = activeStatuses.reduce(
      (sum, status) => sum + breakdown[status],
      0
    );

    const completedBookings = breakdown[PetSitterBookingStatus.COMPLETED];

    const failedBookings = failedStatuses.reduce(
      (sum, status) => sum + breakdown[status],
      0
    );

    const totalBookings = activeBookings + completedBookings + failedBookings;

    return ApiResponse.success('Booking summary fetched successfully', {
      totalBookings,
      activeBookings,
      completedBookings,
      failedBookings,
      bookingBreakdown: breakdown,
    });
  }

  async getRecentBookings(userId: string) {
    const petOwner = await this.prisma.petOwnerProfile.findFirst({
      where: {
        userId,
        user: { status: 'ACTIVE' },
      },
      select: { id: true },
    });

    if (!petOwner) {
      throw new NotFoundException('Pet owner not found');
    }

    const bookings = await this.prisma.petSitterBooking.findMany({
      where: { clientId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        startingTime: true,
        finishingTime: true,
        status: true,
        grandTotal: true,
        createdAt: true,
        petSitter: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                fullName: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return ApiResponse.success(
      'Recent bookings fetched successfully',
      bookings
    );
  }

  async topPetSitters(userId: string) {
    // 1️⃣ Verify the pet owner exists
    const petOwner = await this.prisma.petOwnerProfile.findFirst({
      where: { userId, user: { status: 'ACTIVE' } },
      select: { id: true },
    });

    if (!petOwner) throw new NotFoundException('Pet owner not found');

    // 2️⃣ Aggregate booking count per pet sitter
    const topSitterAggregates = await this.prisma.petSitterBooking.groupBy({
      by: ['petSitterProfileId'],
      where: { clientId: userId },
      _count: { id: true }, // count number of bookings
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    // 3️⃣ Fetch pet sitter info separately
    const result = await Promise.all(
      topSitterAggregates.map(async (agg) => {
        const petSitter = await this.prisma.petSitterProfile.findUnique({
          where: { id: agg.petSitterProfileId },
          select: {
            id: true,
            user: { select: { id: true, fullName: true, image: true } },
          },
        });

        return {
          petSitterId: agg.petSitterProfileId,
          bookingCount: agg._count.id, // number of bookings
          petSitter,
        };
      })
    );

    // 4️⃣ Return response
    return ApiResponse.success('Top pet sitters fetched successfully', result);
  }

  async getTopServicesAndPackages(userId: string) {
    // 1️⃣ Aggregate top service packages
    const topPackages = await this.prisma.petSitterBooking.groupBy({
      by: ['packageId'],
      where: { clientId: userId, packageId: { not: null } },
      _count: { packageId: true },
      orderBy: { _count: { packageId: 'desc' } },
      take: 5,
    });

    // 2️⃣ Aggregate top individual services
    const topServices = await this.prisma.petSitterBooking.groupBy({
      by: ['serviceId'],
      where: { clientId: userId, serviceId: { not: null } },
      _count: { serviceId: true },
      orderBy: { _count: { serviceId: 'desc' } },
      take: 5,
    });

    // 3️⃣ Filter out nulls
    const packageIds = topPackages
      .map((p) => p.packageId)
      .filter((id): id is string => id !== null);
    const serviceIds = topServices
      .map((s) => s.serviceId)
      .filter((id): id is string => id !== null);

    // 4️⃣ Fetch minimal details
    const [packages, services] = await Promise.all([
      this.prisma.package.findMany({
        where: { id: { in: packageIds } },
        select: {
          id: true,
          name: true,
          image: true,
          offeredPrice: true,
          durationInMinutes: true,
        },
      }),
      this.prisma.service.findMany({
        where: { id: { in: serviceIds } },
        select: {
          id: true,
          name: true,
          thumbnailImage: true,
          durationInMinutes: true,
          price: true,
        },
      }),
    ]);

    // 5️⃣ Map booking counts
    const topPackagesResult = packages.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      image: pkg.image,
      price: pkg.offeredPrice,
      durationInMinutes: pkg.durationInMinutes,
      bookingCount:
        topPackages.find((p) => p.packageId === pkg.id)?._count?.packageId || 0,
    }));

    const topServicesResult = services.map((svc) => ({
      id: svc.id,
      name: svc.name,
      image: svc.thumbnailImage,
      price: svc.price,
      durationInMinutes: svc.durationInMinutes,
      bookingCount:
        topServices.find((s) => s.serviceId === svc.id)?._count?.serviceId || 0,
    }));

    return ApiResponse.success(
      'Top services and packages fetched successfully',
      {
        topPackages: topPackagesResult,
        topServices: topServicesResult,
      }
    );
  }

  async getMyBookingHistory(
    userId: string,
    search?: string,
    cursor?: string,
    limit = 10
  ) {
    limit = Math.min(limit, 50);

    const where: Prisma.PetSitterBookingWhereInput = { clientId: userId };

    if (search?.trim()) {
      const term = search.trim();
      where.OR = [
        { package: { name: { contains: term, mode: 'insensitive' } } },
        { service: { name: { contains: term, mode: 'insensitive' } } },
        {
          petSitter: {
            user: { fullName: { contains: term, mode: 'insensitive' } },
          },
        },
      ];
    }

    const bookings = await this.prisma.petSitterBooking.findMany({
      where,
      select: {
        id: true,
        createdAt: true,
        startingTime: true,
        finishingTime: true,
        status: true,
        isLate: true,

        petSitter: {
          select: {
            id: true,
            user: { select: { id: true, fullName: true } },
          },
        },
        package: { select: { id: true, name: true, offeredPrice: true } },
        service: { select: { id: true, name: true, price: true } },
      },
      orderBy: { createdAt: 'desc' },
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1,
      skip: cursor ? 1 : 0,
    });

    const hasNextPage = bookings.length > limit;
    const resultBookings = bookings.slice(0, limit);
    const nextCursor = hasNextPage
      ? resultBookings[resultBookings.length - 1].id
      : undefined;

    return ApiResponse.success('Booking history fetched successfully', {
      bookings: resultBookings,
      hasNextPage,
      nextCursor,
    });
  }

  async historyWithPetsitter(
    userId: string,
    petSitterId: string,
    limit = 10,
    cursor?: string,
    search?: string
  ) {
    // Ensure limit is within reasonable bounds
    limit = Math.min(limit, 50);

    // 1️⃣ Fetch the pet owner ID
    const petOwner = await this.prisma.petOwnerProfile.findFirst({
      where: { userId, user: { status: 'ACTIVE' } },
      select: { id: true },
    });

    if (!petOwner) throw new NotFoundException('Pet owner not found');

    // 2️⃣ Build the query filter
    const where: Prisma.PetSitterBookingWhereInput = {
      petSitterProfileId: petSitterId,
      clientId: userId,
    };

    if (search?.trim()) {
      const term = search.trim();
      where.OR = [
        { package: { name: { contains: term, mode: 'insensitive' } } },
        { service: { name: { contains: term, mode: 'insensitive' } } },
        {
          petSitter: {
            user: { fullName: { contains: term, mode: 'insensitive' } },
          },
        },
        {
          pets: {
            some: { pet: { petName: { contains: term, mode: 'insensitive' } } },
          },
        },
      ];
    }

    // 3️⃣ Fetch bookings with optimized select
    const bookings = await this.prisma.petSitterBooking.findMany({
      where,
      select: {
        id: true,
        createdAt: true,
        startingTime: true,
        finishingTime: true,
        status: true,
        isLate: true,
        petSitter: {
          select: {
            id: true,
            user: { select: { id: true, fullName: true, image: true } }, // optional image
          },
        },
        package: { select: { id: true, name: true, offeredPrice: true } },
        service: { select: { id: true, name: true, price: true } },
        pets: {
          select: {
            petId: true,
            pet: { select: { petName: true, profileImg: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1, // fetch one extra to check next page
      skip: cursor ? 1 : 0,
    });

    // 4️⃣ Handle pagination
    const hasNextPage = bookings.length > limit;
    const resultBookings = bookings.slice(0, limit);
    const nextCursor = hasNextPage
      ? resultBookings[resultBookings.length - 1].id
      : undefined;

    // 5️⃣ Return structured API response
    return ApiResponse.success('Booking history fetched successfully', {
      bookings: resultBookings,
      hasNextPage,
      nextCursor,
    });
  }
}
