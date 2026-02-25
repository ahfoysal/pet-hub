import { Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';

const ACTIVE_STATUSES: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.CHECKED_IN,
];

const NON_CANCELLED_STATUSES: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.CHECKED_IN,
  BookingStatus.CHECKED_OUT,
];

const MONTH_NAMES = [
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

/** Get start of day (00:00:00) in local time */
function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Get end of day (23:59:59.999) */
function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

/** Number of nights between checkIn and checkOut (exclusive of checkOut day) */
function nightsBetween(checkIn: Date, checkOut: Date): number {
  const a = startOfDay(checkIn).getTime();
  const b = startOfDay(checkOut).getTime();
  return Math.max(0, Math.ceil((b - a) / (24 * 60 * 60 * 1000)));
}

/** Overlap in nights of a booking with a date range [rangeStart, rangeEnd) */
function occupiedNightsInRange(
  checkIn: Date,
  checkOut: Date,
  rangeStart: Date,
  rangeEnd: Date
): number {
  const start = new Date(Math.max(checkIn.getTime(), rangeStart.getTime()));
  const end = new Date(Math.min(checkOut.getTime(), rangeEnd.getTime()));
  if (start >= end) return 0;
  return nightsBetween(start, end);
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(hotelProfileId: string) {
    const [stats, charts, recentBookings] = await Promise.all([
      this.getStats(hotelProfileId),
      this.getCharts(hotelProfileId),
      this.getRecentBookings(hotelProfileId),
    ]);

    return ApiResponse.success('Dashboard data found', {
      stats,
      charts,
      recentBookings,
    });
  }

  async getStats(hotelProfileId: string) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    startOfDay(thirtyDaysAgo);

    const [
      totalBookings,
      totalActiveBookings,
      totalCompletedBookings,
      upcomingCheckins,
      roomCount,
      bookingsForOccupancy,
      bookingsForAvgStay,
      totalRevenueResult,
    ] = await Promise.all([
      this.prisma.booking.count({
        where: { hotelProfileId, status: { in: NON_CANCELLED_STATUSES } },
      }),
      this.prisma.booking.count({
        where: {
          hotelProfileId,
          status: { in: ACTIVE_STATUSES },
        },
      }),
      this.prisma.booking.count({
        where: {
          hotelProfileId,
          status: BookingStatus.CHECKED_OUT,
        },
      }),
      this.prisma.booking.count({
        where: {
          hotelProfileId,
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
          checkInTime: { gte: startOfDay(now) },
        },
      }),
      this.prisma.room.count({
        where: { hotelProfileId },
      }),
      this.prisma.booking.findMany({
        where: {
          hotelProfileId,
          status: { in: NON_CANCELLED_STATUSES },
          checkOutTime: { gte: thirtyDaysAgo },
          checkInTime: { lte: endOfDay(now) },
        },
        select: {
          checkInTime: true,
          checkOutTime: true,
        },
      }),
      this.prisma.booking.findMany({
        where: {
          hotelProfileId,
          status: BookingStatus.CHECKED_OUT,
        },
        select: {
          checkInTime: true,
          checkOutTime: true,
        },
      }),
      this.prisma.booking.aggregate({
        where: {
          hotelProfileId,
          status: { in: NON_CANCELLED_STATUSES },
        },
        _sum: { grandTotal: true },
      }),
    ]);

    const totalAvailableRoomNights = roomCount * 30;
    let occupiedRoomNights = 0;
    for (const b of bookingsForOccupancy) {
      occupiedRoomNights += occupiedNightsInRange(
        b.checkInTime,
        b.checkOutTime,
        thirtyDaysAgo,
        now
      );
    }
    const avgOccupancyRate =
      totalAvailableRoomNights > 0
        ? Math.round(
            (occupiedRoomNights / totalAvailableRoomNights) * 100 * 100
          ) / 100
        : 0;

    let avgStayDurationDays = 0;
    if (bookingsForAvgStay.length > 0) {
      const totalNights = bookingsForAvgStay.reduce(
        (acc, b) => acc + nightsBetween(b.checkInTime, b.checkOutTime),
        0
      );
      avgStayDurationDays =
        Math.round((totalNights / bookingsForAvgStay.length) * 100) / 100;
    }

    const totalRevenue = totalRevenueResult._sum.grandTotal ?? 0;

    return {
      totalBookings: {
        value: totalBookings,
        growth: "+36%" // Placeholder or calculate
      },
      activeBookings: {
        value: totalActiveBookings,
        growth: "+36%"
      },
      completedBookings: {
        value: totalCompletedBookings,
        growth: "+36%"
      },
      upcomingCheckins: {
        value: upcomingCheckins,
        growth: "+36%"
      },
      avgOccupancyRate,
      avgStayDurationDays,
      totalRevenue,
    };
  }

  async getCharts(hotelProfileId: string) {
    const [monthlyBookingTrend, weeklyOccupancyRate, roomTypeDistribution] =
      await Promise.all([
        this.getMonthlyBookingTrend(hotelProfileId),
        this.getWeeklyOccupancyRate(hotelProfileId),
        this.getRoomTypeDistribution(hotelProfileId),
      ]);

    return {
      monthlyBookingTrend,
      weeklyOccupancyRate,
      roomTypeDistribution,
    };
  }

  /** Last 12 months: booking count per month (by checkIn month) */
  async getMonthlyBookingTrend(hotelProfileId: string) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    start.setHours(0, 0, 0, 0);

    const bookings = await this.prisma.booking.findMany({
      where: {
        hotelProfileId,
        status: { in: NON_CANCELLED_STATUSES },
        checkInTime: { gte: start },
      },
      select: { checkInTime: true },
    });

    const countByMonth = new Map<string, number>();
    for (let i = 0; i < 12; i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      countByMonth.set(key, 0);
    }

    for (const b of bookings) {
      const key = `${b.checkInTime.getFullYear()}-${String(b.checkInTime.getMonth() + 1).padStart(2, '0')}`;
      if (countByMonth.has(key)) {
        countByMonth.set(key, (countByMonth.get(key) ?? 0) + 1);
      }
    }

    const sortedKeys = [...countByMonth.keys()].sort();
    const labels = sortedKeys.map((k) => {
      const [y, m] = k.split('-');
      return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
    });
    const data = sortedKeys.map((k) => countByMonth.get(k) ?? 0);

    return { labels, data };
  }

  /** Last 12 completed weeks (Mon–Sun): occupancy % per week */
  async getWeeklyOccupancyRate(hotelProfileId: string) {
    const roomCount = await this.prisma.room.count({
      where: { hotelProfileId },
    });

    if (roomCount === 0) {
      return { labels: [] as string[], data: [] as number[] };
    }

    const now = new Date();
    const weeks: { start: Date; end: Date; label: string }[] = [];
    for (let w = 12; w >= 1; w--) {
      const sunday = new Date(now);
      sunday.setDate(sunday.getDate() - sunday.getDay() - (w - 1) * 7);
      sunday.setHours(23, 59, 59, 999);
      const monday = new Date(sunday);
      monday.setDate(sunday.getDate() - 6);
      monday.setHours(0, 0, 0, 0);
      weeks.push({
        start: monday,
        end: sunday,
        label: `Week ${13 - w}`,
      });
    }

    const firstStart = weeks[0]?.start ?? now;
    const lastEnd = weeks[weeks.length - 1]?.end ?? now;

    const bookings = await this.prisma.booking.findMany({
      where: {
        hotelProfileId,
        status: { in: NON_CANCELLED_STATUSES },
        checkOutTime: { gt: firstStart },
        checkInTime: { lt: lastEnd },
      },
      select: { checkInTime: true, checkOutTime: true },
    });

    const data = weeks.map((week) => {
      let occupied = 0;
      for (const b of bookings) {
        occupied += occupiedNightsInRange(
          b.checkInTime,
          b.checkOutTime,
          week.start,
          new Date(week.end.getTime() + 1)
        );
      }
      const available = roomCount * 7;
      const rate = available > 0 ? (occupied / available) * 100 : 0;
      return Math.round(rate * 100) / 100;
    });

    return {
      labels: weeks.map((w) => w.label),
      data,
    };
  }

  /** Room type distribution: booking count per room type (last 12 months) */
  async getRoomTypeDistribution(hotelProfileId: string) {
    const start = new Date();
    start.setMonth(start.getMonth() - 11);
    start.setHours(0, 0, 0, 0);

    const bookings = await this.prisma.booking.findMany({
      where: {
        hotelProfileId,
        status: { in: NON_CANCELLED_STATUSES },
        checkInTime: { gte: start },
      },
      select: {
        room: { select: { roomType: true } },
      },
    });

    const countByType = new Map<string, number>();
    for (const b of bookings) {
      const t = b.room.roomType;
      countByType.set(t, (countByType.get(t) ?? 0) + 1);
    }

    const roomTypes = ['PET_ONLY', 'PET_WITH_ACCO'];
    const labels = roomTypes.map((t) =>
      t === 'PET_WITH_ACCO' ? 'Pet with accommodation' : 'Pet only'
    );
    const data = roomTypes.map((t) => countByType.get(t) ?? 0);

    return { labels, data };
  }

  /** Recent bookings for the table view */
  async getRecentBookings(hotelProfileId: string) {
    return this.prisma.booking.findMany({
      where: { hotelProfileId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        checkInTime: true,
        checkOutTime: true,
        status: true,
        grandTotal: true,
        user: {
          select: {
            fullName: true,
          },
        },
        room: {
          select: {
            roomName: true,
            roomNumber: true,
          },
        },
        petIds: true, // we might need common/utils to fetch pet names if stored separately
      },
    });
  }
}
