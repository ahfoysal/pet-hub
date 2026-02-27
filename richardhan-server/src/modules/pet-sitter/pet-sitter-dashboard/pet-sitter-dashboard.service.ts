import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingType, Prisma } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class PetSitterDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------- Helper ----------------------
  private async getActivePetSitter(userId: string) {
    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
      select: { id: true, profileStatus: true },
    });
    if (!petSitter || petSitter.profileStatus !== 'ACTIVE') {
      throw new NotFoundException('Pet sitter not found');
    }
    return petSitter;
  }

  private formatBookings(bookings: any[]) {
    return bookings.map((b) => ({
      id: b.id,
      startingTime: b.startingTime,
      finishingTime: b.finishingTime,
      price: b.price,
      grandTotal: b.grandTotal,
      pets: b.pets.map((p) => ({ id: p.petId, name: p.pet.petName })),
      package: b.package ? { id: b.package.id, name: b.package.name } : null,
      service: b.service ? { id: b.service.id, name: b.service.name } : null,
      client: b.user
        ? { id: b.user.id, name: b.user.fullName, image: b.user.image }
        : null,
    }));
  }

  // ---------------------- Stats ----------------------
  async getStatsForMe(userId: string) {
    const petSitter = await this.getActivePetSitter(userId);
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

    const [
      packageGroups,
      serviceGroups,
      bookingGroups,
      activeClientsCount,
      revenueResult,
      reviewResult,
      payoutResult,
    ] = await Promise.all([
      this.prisma.package.groupBy({
        by: ['isAvailable'],
        where: { petSitterId: petSitter.id, isDeleted: false },
        _count: true,
      }),
      this.prisma.service.groupBy({
        by: ['isAvailable'],
        where: { petSitterId: petSitter.id, isDeleted: false },
        _count: true,
      }),
      this.prisma.petSitterBooking.groupBy({
        by: ['status'],
        where: { petSitterProfileId: petSitter.id },
        _count: true,
      }),
      this.prisma.petSitterBooking.groupBy({
        by: ['clientId'],
        where: {
          petSitterProfileId: petSitter.id,
          createdAt: { gte: startOfYear },
          status: { in: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'] },
        },
      }),
      this.prisma.petSitterBooking.aggregate({
        where: { petSitterProfileId: petSitter.id, status: 'COMPLETED' },
        _sum: { grandTotal: true },
      }),
      this.prisma.petSitterReview.aggregate({
        where: { petSitterId: petSitter.id, isDeleted: false },
        _avg: { rating: true },
        _count: true,
      }),
      this.prisma.petSitterBooking.aggregate({
        where: {
          petSitterProfileId: petSitter.id,
          status: 'COMPLETED',
          payments: {
            none: { status: 'SUCCESS' },
          },
        },
        _sum: { grandTotal: true },
      }),
    ]);

    const countByAvailability = (groups: typeof packageGroups) => {
      const available = groups.find((g) => g.isAvailable)?._count || 0;
      const total = groups.reduce((sum, g) => sum + g._count, 0);
      return { total, available, unavailable: total - available };
    };

    const packages = countByAvailability(packageGroups);
    const services = countByAvailability(serviceGroups);

    const allStatuses = [
      'PENDING',
      'CONFIRMED',
      'IN_PROGRESS',
      'REQUEST_TO_COMPLETE',
      'COMPLETED',
      'CANCELLED',
      'EXPIRED',
      'LATE',
    ] as const;

    const statusCounts = bookingGroups.reduce(
      (acc, g) => {
        acc[g.status] = g._count;
        return acc;
      },
      {} as Record<string, number>
    );

    const bookingsByStatus = allStatuses.reduce(
      (acc, status) => {
        acc[status] = statusCounts[status] || 0;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalBookings = Object.values(bookingsByStatus).reduce(
      (sum, val) => sum + val,
      0
    );
    const actionRequired =
      (bookingsByStatus.PENDING || 0) +
      (bookingsByStatus.REQUEST_TO_COMPLETE || 0) +
      (bookingsByStatus.LATE || 0);
    const active =
      (bookingsByStatus.CONFIRMED || 0) +
      (bookingsByStatus.IN_PROGRESS || 0) +
      (bookingsByStatus.REQUEST_TO_COMPLETE || 0);

    const totalEarnings = revenueResult._sum.grandTotal || 0;
    const averageRating = reviewResult._avg.rating || 0;
    const reviewCount = reviewResult._count || 0;
    const pendingPayout = payoutResult._sum.grandTotal || 0;

    // Calculate average services per month for the current year
    const completedThisYear = await this.prisma.petSitterBooking.count({
      where: {
        petSitterProfileId: petSitter.id,
        status: 'COMPLETED',
        createdAt: { gte: startOfYear },
      },
    });
    const monthsPassed = now.getMonth() + 1;
    const avgServices = Number((completedThisYear / monthsPassed).toFixed(1));

    const ratingTrend: { name: string; rating: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const monthName = d.toLocaleString('en-US', { month: 'short' });
      
      const ratingTrendData = await this.prisma.petSitterReview.aggregate({
        where: {
          petSitterId: petSitter.id,
          isDeleted: false,
          createdAt: {
            gte: new Date(y, m - 1, 1),
            lt: new Date(y, m, 1),
          },
        },
        _avg: { rating: true },
      });

      ratingTrend.push({
        name: monthName,
        rating: ratingTrendData._avg.rating || 0,
      });
    }

    return ApiResponse.success("Pet sitter stats fetched successfully", {
      packages,
      services,
      activeClients: activeClientsCount.length,
      totalRevenue: totalEarnings,
      totalEarnings: totalEarnings, 
      pendingPayout,
      averageRating,
      reviewCount,
      avgServices,
      ratingTrend,
      bookings: {
        total: totalBookings,
        byStatus: bookingsByStatus,
        actionRequired,
        active,
      },
    });
  }

  // ---------------------- Booking Ratios ----------------------
  async getPieChartForBookingRatioByPackagesServices(userId: string) {
    const petSitter = await this.getActivePetSitter(userId);

    const bookings = await this.prisma.petSitterBooking.groupBy({
      by: ['bookingType'],
      where: { petSitterProfileId: petSitter.id },
      _count: true,
    });

    const typeCounts: Record<BookingType, number> = { PACKAGE: 0, SERVICE: 0 };
    bookings.forEach((b) => (typeCounts[b.bookingType] = b._count));

    const total = bookings.reduce((sum, b) => sum + b._count, 0);
    const chartData = [
      {
        type: 'Package Booking',
        count: typeCounts.PACKAGE || 0,
        percentage: total > 0 ? Number(((typeCounts.PACKAGE / total) * 100).toFixed(1)) : 0,
      },
      {
        type: 'Regular Booking',
        count: typeCounts.SERVICE || 0,
        percentage: total > 0 ? Number(((typeCounts.SERVICE / total) * 100).toFixed(1)) : 0,
      }
    ];

    return ApiResponse.success("Pet sitter's booking ratio found", chartData);
  }

  // ---------------------- Top Packages/Services ----------------------
  async getTopPackages(userId: string) {
    const petSitter = await this.getActivePetSitter(userId);

    const packages = await this.prisma.package.findMany({
      where: { petSitterId: petSitter.id, isDeleted: false },
      orderBy: { petSitterBookings: { _count: 'desc' } },
      take: 5,
      select: {
        id: true,
        name: true,
        _count: { select: { petSitterBookings: true } },
      },
    });

    const result = packages.map((p) => ({
      id: p.id,
      name: p.name,
      bookingsCount: p._count.petSitterBookings,
    }));

    return ApiResponse.success('Top packages fetched successfully', result);
  }

  async getTopServices(userId: string) {
    const petSitter = await this.getActivePetSitter(userId);

    const services = await this.prisma.service.findMany({
      where: { petSitterId: petSitter.id, isDeleted: false },
      orderBy: { petSitterBookings: { _count: 'desc' } },
      take: 5,
      select: {
        id: true,
        name: true,
        _count: { select: { petSitterBookings: true } },
      },
    });

    const result = services.map((s) => ({
      id: s.id,
      name: s.name,
      bookingsCount: s._count.petSitterBookings,
    }));

    return ApiResponse.success('Top services fetched successfully', result);
  }

  // ---------------------- Least Performing Packages/Services ----------------------
  async getLeastPerformingPackages(userId: string) {
    const petSitter = await this.getActivePetSitter(userId);

    const packages = await this.prisma.package.findMany({
      where: { petSitterId: petSitter.id, isDeleted: false },
      select: {
        id: true,
        name: true,
        _count: { select: { petSitterBookings: true } },
      },
    });

    const sorted = packages
      .map((p) => ({ ...p, bookingCount: p._count.petSitterBookings }))
      .sort((a, b) => a.bookingCount - b.bookingCount);

    return ApiResponse.success(
      'Least performing packages fetched successfully',
      sorted
    );
  }

  async getLeastPerformingServices(userId: string) {
    const petSitter = await this.getActivePetSitter(userId);

    const services = await this.prisma.service.findMany({
      where: { petSitterId: petSitter.id, isDeleted: false },
      select: {
        id: true,
        name: true,
        _count: { select: { petSitterBookings: true } },
      },
    });

    const sorted = services
      .map((s) => ({ ...s, bookingCount: s._count.petSitterBookings }))
      .sort((a, b) => a.bookingCount - b.bookingCount);

    return ApiResponse.success(
      'Least performing services fetched successfully',
      sorted
    );
  }

  // ---------------------- Recent/Upcoming Bookings ----------------------
  async getRecentBookings(userId: string) {
    const petSitter = await this.getActivePetSitter(userId);

    const bookings = await this.prisma.petSitterBooking.findMany({
      where: { petSitterProfileId: petSitter.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        startingTime: true,
        finishingTime: true,
        price: true,
        grandTotal: true,
        pets: { select: { petId: true, pet: { select: { petName: true } } } },
        package: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
        user: { select: { id: true, fullName: true, image: true } },
      },
    });

    return ApiResponse.success(
      'Recent bookings fetched successfully',
      this.formatBookings(bookings)
    );
  }

  async getUpcomingBookings(userId: string) {
    const petSitter = await this.getActivePetSitter(userId);
    const now = new Date();

    const bookings = await this.prisma.petSitterBooking.findMany({
      where: {
        petSitterProfileId: petSitter.id,
        status: 'CONFIRMED',
        startingTime: { gt: now },
      },
      orderBy: { startingTime: 'asc' },
      take: 10,
      select: {
        id: true,
        startingTime: true,
        finishingTime: true,
        price: true,
        grandTotal: true,
        pets: { select: { petId: true, pet: { select: { petName: true } } } },
        package: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
        user: { select: { id: true, fullName: true, image: true } },
      },
    });

    return ApiResponse.success(
      'Upcoming bookings fetched successfully',
      this.formatBookings(bookings)
    );
  }

  // ---------------------- Top Customers ----------------------
  async getTopCustomers(userId: string) {
    const petSitter = await this.getActivePetSitter(userId);

    const grouped = await this.prisma.petSitterBooking.groupBy({
      by: ['clientId'],
      where: { petSitterProfileId: petSitter.id, status: 'COMPLETED' },
      _count: { clientId: true },
      orderBy: { _count: { clientId: 'desc' } },
      take: 5,
    });

    if (!grouped.length)
      return ApiResponse.success('Top customers fetched successfully', []);

    const clientIds = grouped.map((g) => g.clientId);
    const clients = await this.prisma.user.findMany({
      where: { id: { in: clientIds } },
      select: { id: true, fullName: true, email: true, image: true },
    });

    const result = grouped.map((g) => ({
      clientId: g.clientId,
      totalBookings: g._count.clientId,
      client: clients.find((c) => c.id === g.clientId) || null,
    }));

    return ApiResponse.success('Top customers fetched successfully', result);
  }

  // ---------------------- Booking Trends ----------------------
  async getBookingTrends(userId: string) {
    const petSitter = await this.getActivePetSitter(userId);
    
    const trends: { name: string; totalBookings: number; revenue: number }[] = [];
    const now = new Date();
    
    for (let i = 14; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      
      const dayLabel = d.getDate().toString();
      
      const dailyData = await this.prisma.petSitterBooking.aggregate({
        where: {
          petSitterProfileId: petSitter.id,
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
        _count: true,
        _sum: { grandTotal: true },
      });

      trends.push({
        name: dayLabel,
        totalBookings: dailyData._count || 0,
        revenue: Number(dailyData._sum?.grandTotal || 0),
      });
    }

    return ApiResponse.success('Booking trends fetched successfully', {
      year: new Date().getFullYear(),
      data: trends,
    });
  }

  async getMyClientList(
    userId: string,
    search?: string,
    cursor?: string,
    limit = 10
  ) {
    limit = Math.min(limit, 50);

    const petSitter = await this.getActivePetSitter(userId);

    // Build base where for bookings
    const bookingWhere: Prisma.PetSitterBookingWhereInput = {
      petSitterProfileId: petSitter.id,
    };

    // Optional search on client name/email
    if (search?.trim()) {
      const term = search.trim();
      bookingWhere.user = {
        OR: [
          { fullName: { contains: term, mode: 'insensitive' } },
          { email: { contains: term, mode: 'insensitive' } },
        ],
      };
    }

    // Group bookings by clientId with count
    const clientBookings = await this.prisma.petSitterBooking.groupBy({
      by: ['clientId'],
      where: bookingWhere,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }, // clients with most bookings first
    });

    // Pagination
    const startIndex = cursor
      ? clientBookings.findIndex((cb) => cb.clientId === cursor) + 1
      : 0;
    const paginated = clientBookings.slice(startIndex, startIndex + limit);
    const hasNextPage = startIndex + limit < clientBookings.length;
    const nextCursor = hasNextPage
      ? paginated[paginated.length - 1].clientId
      : undefined;

    const clientIds = paginated.map((cb) => cb.clientId);

    // Fetch client info for paginated IDs
    const clients = await this.prisma.user.findMany({
      where: { id: { in: clientIds } },
      select: {
        id: true,
        fullName: true,
        email: true,
        image: true,
      },
    });

    // Combine client info with booking count
    const result = clients.map((client) => {
      const bookingInfo = paginated.find((cb) => cb.clientId === client.id);
      return {
        ...client,
        bookingCount: bookingInfo?._count.id ?? 0,
      };
    });

    return ApiResponse.success('My client list fetched successfully', {
      clients: result,
      hasNextPage,
      nextCursor,
    });
  }

  async getHistoryWithClients(
    userId: string,
    clientId: string,
    limit = 10,
    cursor?: string,
    search?: string
  ) {
    // 1️⃣ Get the active pet sitter
    const petSitter = await this.getActivePetSitter(userId);
    if (!petSitter) {
      throw new NotFoundException('Active pet sitter not found');
    }

    // 2️⃣ Build the where clause
    const where: Prisma.PetSitterBookingWhereInput = {
      petSitterProfileId: petSitter.id,
      clientId,
    };

    if (search) {
      where.OR = [
        {
          pets: {
            some: {
              pet: {
                petName: { contains: search, mode: 'insensitive' },
              },
            },
          },
        },
        { package: { name: { contains: search, mode: 'insensitive' } } },
        { service: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // 3️⃣ Fetch bookings with pagination
    const bookings = await this.prisma.petSitterBooking.findMany({
      where,
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0, // skip the cursor itself
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        startingTime: true,
        finishingTime: true,
        price: true,
        grandTotal: true,
        pets: { select: { petId: true, pet: { select: { petName: true } } } },
        package: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
      },
    });

    // 4️⃣ Determine the next cursor for pagination
    const nextCursor =
      bookings.length === limit ? bookings[bookings.length - 1].id : null;

    // 5️⃣ Return API response
    return ApiResponse.success('History with clients fetched successfully', {
      bookings,
      nextCursor,
    });
  }
}
