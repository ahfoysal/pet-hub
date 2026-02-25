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

    const [
      packageGroups,
      serviceGroups,
      bookingGroups,
      activeClientsCount,
      revenueResult,
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

    return ApiResponse.success("Pet sitter's stats found", {
      packages,
      services,
      activeClients: activeClientsCount.length,
      totalRevenue: revenueResult._sum.grandTotal || 0,
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

    const chartData = (['PACKAGE', 'SERVICE'] as BookingType[]).map((type) => ({
      type: type === 'PACKAGE' ? 'Package' : 'Service',
      count: typeCounts[type],
    }));

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
  async getBookingTrends(userId: string, year?: number) {
    const petSitter = await this.getActivePetSitter(userId);
    const targetYear = year ?? new Date().getFullYear();
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear + 1, 0, 1);

    const monthlyCounts = await this.prisma.$queryRaw<
      { month: number; count: bigint }[]
    >`
      SELECT EXTRACT(MONTH FROM "createdAt")::int as month,
             COUNT(*) as count
      FROM "PetSitterBooking"
      WHERE "petSitterProfileId" = ${petSitter.id}
        AND "createdAt" >= ${startDate}
        AND "createdAt" < ${endDate}
      GROUP BY month
      ORDER BY month;
    `;

    const monthlyData = Array(12).fill(0);
    monthlyCounts.forEach(
      (row) => (monthlyData[row.month - 1] = Number(row.count))
    );

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const data = months.map((m, i) => ({
      month: m,
      totalBookings: monthlyData[i],
    }));

    return ApiResponse.success('Booking trends fetched successfully', {
      year: targetYear,
      data,
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
