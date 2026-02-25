import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { Role } from 'src/common/types/auth.types';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class AdminDashboardOverviewService {
  constructor(private readonly prisma: PrismaService) {}

  // Get count of active users grouped by role (excluding admins)
  async getUsersCountByRole() {
    const roles = Object.values(Role).filter((role) => role !== Role.ADMIN);

    const data: Record<string, number> = {};
    roles.forEach((role) => (data[role] = 0));

    const grouped = await this.prisma.user.groupBy({
      by: ['role'],
      _count: { id: true },
      where: {
        status: 'ACTIVE',
        role: { not: Role.ADMIN },
      },
    });

    grouped.forEach((item) => {
      if (item.role) data[item.role] = item._count.id;
    });

    return ApiResponse.success('Users count by role', data);
  }

  // Get Analytics specifically for Admins
  async getAdminAnalytics() {
    const totalAdmins = await this.prisma.user.count({
      where: { role: Role.ADMIN },
    });

    const activeAdmins = await this.prisma.user.count({
      where: { role: Role.ADMIN, status: 'ACTIVE' },
    });

    const suspendedAdmins = await this.prisma.user.count({
      where: { role: Role.ADMIN, status: 'SUSPENDED' },
    });

    const totalActionsTaken = await this.prisma.report.count({
      where: { status: 'ACTION_TAKEN' },
    });

    return ApiResponse.success('Admin analytics fetched successfully', {
      totalAdmins,
      activeAdmins,
      suspendedAdmins,
      totalActionsTaken,
    });
  }

  // Get list of Admins with pagination and search
  async getAllAdmins(search?: string, cursor?: string, limit = 20) {
    const safeLimit = Math.min(limit, 50);

    const baseWhere: Prisma.UserWhereInput = {
      role: Role.ADMIN,
    };

    const whereQuery: Prisma.UserWhereInput = search
      ? {
          OR: [
            {
              ...baseWhere,
              fullName: { contains: search, mode: 'insensitive' },
            },
            { ...baseWhere, email: { contains: search, mode: 'insensitive' } },
            { ...baseWhere, userName: { contains: search, mode: 'insensitive' } },
          ],
        }
      : baseWhere;

    const users = await this.prisma.user.findMany({
      where: whereQuery,
      take: safeLimit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    });

    const hasNextPage = users.length > safeLimit;
    if (hasNextPage) users.pop();

    return ApiResponse.success('Admins fetched successfully', {
      data: users,
      nextCursor: hasNextPage ? users[users.length - 1].id : null,
    });
  }

  // Get 5 most recent KYC records
  async getRecentKyc() {
    const data = await this.prisma.kYC.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        status: true,
        createdAt: true,
        fullName: true,
        roleType: true,
      },
    });

    return ApiResponse.success('Recent kyc', data);
  }

  // Get active pet sitters with counts of available services and packages
  async getAllPetSitters(search?: string, cursor?: string, limit = 20) {
    const safeLimit = Math.min(limit, 50);

    const baseWhere: Prisma.UserWhereInput = {
      role: 'PET_SITTER',
      status: 'ACTIVE',
    };

    const whereQuery: Prisma.UserWhereInput = search
      ? {
          OR: [
            {
              ...baseWhere,
              fullName: { contains: search, mode: 'insensitive' },
            },
            { ...baseWhere, email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : baseWhere;

    const users = await this.prisma.user.findMany({
      where: whereQuery,
      take: safeLimit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        phone: true,
        createdAt: true,
        kycs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { status: true },
        },
        petSitterProfiles: {
          select: {
            _count: {
              select: {
                services: { where: { isDeleted: false, isAvailable: true } },
                packages: { where: { isDeleted: false, isAvailable: true } },
              },
            },
          },
        },
      },
    });

    const hasNextPage = users.length > safeLimit;
    if (hasNextPage) users.pop();

    const result = users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      status: user.status,
      kycStatus: user.kycs[0]?.status ?? null,
      servicesCount:
        user.petSitterProfiles?.reduce(
          (acc, profile) => acc + (profile._count?.services ?? 0),
          0
        ) ?? 0,
      packagesCount:
        user.petSitterProfiles?.reduce(
          (acc, profile) => acc + (profile._count?.packages ?? 0),
          0
        ) ?? 0,
    }));

    return ApiResponse.success('Pet sitters fetched successfully', {
      data: result,
      nextCursor: hasNextPage ? users[users.length - 1].id : null,
    });
  }

  // Get active vendors with counts of published products
  async getAllVendors(search?: string, cursor?: string, limit = 20) {
    const safeLimit = Math.min(limit, 50);

    const baseWhere: Prisma.UserWhereInput = {
      role: 'VENDOR',
      status: 'ACTIVE',
    };

    const whereQuery: Prisma.UserWhereInput = search
      ? {
          OR: [
            {
              ...baseWhere,
              fullName: { contains: search, mode: 'insensitive' },
            },
            { ...baseWhere, email: { contains: search, mode: 'insensitive' } },
            { ...baseWhere, phone: { contains: search, mode: 'insensitive' } },
            {
              ...baseWhere,
              vendorProfile: {
                name: { contains: search, mode: 'insensitive' },
                email: { contains: search, mode: 'insensitive' },
              },
            },
          ],
        }
      : baseWhere;

    const users = await this.prisma.user.findMany({
      where: whereQuery,
      take: safeLimit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        status: true,
        createdAt: true,
        role: true,
        kycs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { status: true },
        },
        vendorProfile: {
          select: {
            name: true,
            email: true,
            phone: true,
            _count: {
              select: {
                products: { where: { isPublish: true } },
              },
            },
          },
        },
      },
    });

    const hasNextPage = users.length > safeLimit;
    if (hasNextPage) users.pop();

    const data = users.map((user: any) => {
      const profile = user.vendorProfile;
      const productsCount = profile?._count?.products ?? 0;

      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        status: user.status,
        kycStatus: user.kycs?.[0]?.status ?? null,
        productsCount,
        vendorName: profile?.name ?? null,
        vendorEmail: profile?.email ?? null,
        vendorPhone: profile?.phone ?? null,
        role: user.role,
      };
    });

    return ApiResponse.success('Vendors fetched successfully', {
      data,
      nextCursor: hasNextPage ? data[data.length - 1].id : null,
    });
  }

  // Get active pet hotels with counts of rooms
  async getAllPetHotels(search?: string, cursor?: string, limit = 20) {
    const safeLimit = Math.min(limit, 50);

    const users = await this.prisma.user.findMany({
      where: {
        role: 'PET_HOTEL',
        status: 'ACTIVE',
        ...(search && {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            {
              hotelProfile: {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                ],
              },
            },
          ],
        }),
      },
      take: safeLimit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { id: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        createdAt: true,
        role: true,
        phone: true,
        kycs: { select: { status: true } },
        hotelProfile: {
          select: {
            name: true,
            email: true,
            phone: true,
            _count: { select: { rooms: true } },
          },
        },
      },
    });

    const hasNextPage = users.length > safeLimit;
    if (hasNextPage) users.pop();

    const data = users.map((user) => {
      const profile = user.hotelProfile;
      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
        status: user.status,
        kycStatus: user.kycs[0]?.status ?? null,
        roomsCount: profile?._count?.rooms ?? 0,
        hotelName: profile?.name ?? null,
        hotelEmail: profile?.email ?? null,
        hotelPhone: profile?.phone ?? null,
        role: user.role,
      };
    });

    return ApiResponse.success('Pet hotels fetched successfully', {
      data,
      nextCursor: hasNextPage ? data[data.length - 1].id : null,
    });
  }

  // Get active pet schools with counts of courses
  async getAllSchool(search?: string, cursor?: string, limit = 20) {
    const safeLimit = Math.min(limit, 50);

    const users = await this.prisma.user.findMany({
      where: {
        role: 'PET_SCHOOL',
        status: 'ACTIVE',
        ...(search && {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            {
              petSchoolProfiles: {
                some: {
                  OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                  ],
                },
              },
            },
          ],
        }),
      },
      take: safeLimit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { id: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        role: true,
        phone: true,
        createdAt: true,
        kycs: { select: { status: true } },
        petSchoolProfiles: {
          select: {
            name: true,
            email: true,
            phone: true,
            _count: { select: { courses: true } },
          },
        },
      },
    });

    const hasNextPage = users.length > safeLimit;
    if (hasNextPage) users.pop();

    const data = users.map((user) => {
      const profile = user.petSchoolProfiles[0];
      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
        status: user.status,
        kycStatus: user.kycs[0]?.status ?? null,
        coursesCount: user.petSchoolProfiles.reduce(
          (acc, p) => acc + (p._count?.courses ?? 0),
          0
        ),
        schoolName: profile?.name ?? null,
        schoolEmail: profile?.email ?? null,
        schoolPhone: profile?.phone ?? null,
        role: user.role,
      };
    });

    return ApiResponse.success('Pet schools fetched successfully', {
      data,
      nextCursor: hasNextPage ? data[data.length - 1].id : null,
    });
  }

  // Get active pet owners with counts of confirmed bookings, approved courses, delivered products, and confirmed pet sitter bookings
  async getPetOwners(search?: string, cursor?: string, limit = 20) {
    const safeLimit = Math.min(limit, 50);

    const where: Prisma.UserWhereInput = {
      role: 'PET_OWNER',
      status: 'ACTIVE',
    };

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      take: safeLimit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: { id: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        createdAt: true,
        role: true,
        phone: true,
        _count: {
          select: {
            bookings: {
              where: {
                status: 'CONFIRMED',
              },
            },
            courseUsers: {
              where: {
                status: 'APPROVED',
              },
            },
            orders: {
              where: { status: 'DELIVERED' },
            },
            petSitterBookings: {
              where: { status: 'CONFIRMED' },
            },
          },
        },
      },
    });

    const hasNextPage = users.length > safeLimit;
    const data = hasNextPage ? users.slice(0, safeLimit) : users;

    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    return {
      data,
      meta: {
        nextCursor,
        hasNextPage,
      },
    };
  }

  // Get platform finance statistics
  async getFinanceStats() {
    const totalPayments = await this.prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: {
        amount: true,
        platformFee: true,
      },
    });

    const activeUsers = await this.prisma.user.count({
      where: { status: "ACTIVE" },
    });

    // Total Bookings = Booking + PetSitterBooking + Order + CourseUser
    const bookingsCount = await this.prisma.booking.count();
    const petSitterBookingsCount = await this.prisma.petSitterBooking.count();
    const ordersCount = await this.prisma.order.count();
    const coursesCount = await this.prisma.courseUser.count();

    const totalBookings =
      bookingsCount + petSitterBookingsCount + ordersCount + coursesCount;

    return ApiResponse.success("Finance statistics fetched successfully", {
      totalRevenue: totalPayments._sum.amount ?? 0,
      totalPlatformFees: totalPayments._sum.platformFee ?? 0,
      activeUsers,
      totalBookings,
    });
  }

  // Get all transactions
  async getTransactions(limit = 20, cursor?: string) {
    const safeLimit = Math.min(limit, 50);

    const transactions = await this.prisma.payment.findMany({
      take: safeLimit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
      include: {
        payerUser: { select: { fullName: true, email: true } },
        receiverUser: { select: { fullName: true, email: true } },
      },
    });

    const hasNextPage = transactions.length > safeLimit;
    if (hasNextPage) transactions.pop();

    return ApiResponse.success("Transactions fetched successfully", {
      data: transactions,
      nextCursor: hasNextPage ? transactions[transactions.length - 1].id : null,
    });
  }

  // Get platform growth analytics (Monthly users and bookings)
  async getGrowthAnalytics() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const users = await this.prisma.user.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    });

    // We consider all types of bookings for "growth"
    const bookings = await this.prisma.booking.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const growthMap: Record<string, { users: number; bookings: number }> = {};

    // Initialize last 6 months
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = months[d.getMonth()];
      growthMap[m] = { users: 0, bookings: 0 };
    }

    users.forEach((u) => {
      const m = months[u.createdAt.getMonth()];
      if (growthMap[m]) growthMap[m].users++;
    });

    bookings.forEach((b) => {
      const m = months[b.createdAt.getMonth()];
      if (growthMap[m]) growthMap[m].bookings++;
    });

    const growthData = Object.entries(growthMap)
      .map(([name, data]) => ({
        name,
        ...data,
      }))
      .reverse(); // Chronological order

    return ApiResponse.success("Growth analytics fetched successfully", growthData);
  }

  // Get revenue by provider category
  async getCategoryAnalytics() {
    const results = await this.prisma.payment.groupBy({
      by: ["receiverProfileType"],
      _sum: { amount: true },
      _count: { id: true },
      where: { status: "SUCCESS" },
    });

    const data = results.map((r) => ({
      category: r.receiverProfileType,
      revenue: r._sum.amount ?? 0,
      bookings: r._count.id,
    }));

    return ApiResponse.success(
      "Category analytics fetched successfully",
      data
    );
  }
}
