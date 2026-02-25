import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { BookingStatus } from '@prisma/client';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(hotelProfileId: string) {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const [currentMonthRevenue, lastMonthRevenue, totalBookings, activeGuests] = await Promise.all([
      this.prisma.booking.aggregate({
        where: {
          hotelProfileId,
          status: { not: BookingStatus.CANCELLED },
          createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
        },
        _sum: { grandTotal: true },
      }),
      this.prisma.booking.aggregate({
        where: {
          hotelProfileId,
          status: { not: BookingStatus.CANCELLED },
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
        _sum: { grandTotal: true },
      }),
      this.prisma.booking.count({ where: { hotelProfileId } }),
      this.prisma.booking.count({
        where: {
          hotelProfileId,
          status: BookingStatus.CHECKED_IN,
        },
      }),
    ]);

    const currentRevenue = currentMonthRevenue._sum.grandTotal ?? 0;
    const previousRevenue = lastMonthRevenue._sum.grandTotal ?? 0;
    const revenueGrowth = previousRevenue === 0 ? 100 : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

    return {
      revenue: {
        current: currentRevenue,
        previous: previousRevenue,
        growth: `${revenueGrowth.toFixed(1)}%`,
      },
      bookings: {
        total: totalBookings,
      },
      guests: {
        active: activeGuests,
      },
    };
  }

  async getOccupancyTrends(hotelProfileId: string) {
    const now = new Date();
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
      const date = subMonths(now, i);
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
        label: format(date, 'MMM yyyy'),
      };
    }).reverse();

    const trends = await Promise.all(
      last6Months.map(async (month) => {
        const count = await this.prisma.booking.count({
          where: {
            hotelProfileId,
            status: { not: BookingStatus.CANCELLED },
            checkInTime: { gte: month.start, lte: month.end },
          },
        });
        return { month: month.label, bookings: count };
      }),
    );

    return trends;
  }

  async getRevenueGrowth(hotelProfileId: string) {
    const now = new Date();
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
      const date = subMonths(now, i);
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
        label: format(date, 'MMM'),
      };
    }).reverse();

    const data = await Promise.all(
      last6Months.map(async (month) => {
        const result = await this.prisma.booking.aggregate({
          where: {
            hotelProfileId,
            status: { not: BookingStatus.CANCELLED },
            createdAt: { gte: month.start, lte: month.end },
          },
          _sum: { grandTotal: true },
        });
        return { month: month.label, revenue: result._sum.grandTotal ?? 0 };
      }),
    );

    return data;
  }

  async getRoomDistribution(hotelProfileId: string) {
    const rooms = await this.prisma.room.groupBy({
      by: ['roomType'],
      where: { hotelProfileId },
      _count: { _all: true },
    });

    const total = rooms.reduce((acc, r) => acc + r._count._all, 0);

    return rooms.map((r) => ({
      type: r.roomType,
      count: r._count._all,
      percentage: total > 0 ? Math.round((r._count._all / total) * 100) : 0,
    }));
  }

  async getWeeklyOccupancy(hotelProfileId: string) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    
    // Get total rooms for occupancy rate calculation
    const totalRooms = await this.prisma.room.count({
      where: { hotelProfileId },
    });

    const results = await Promise.all(
      days.map(async (day, index) => {
        // Get the most recent occurrence of this day of week
        const targetDate = new Date(now);
        const currentDay = now.getDay();
        const diff = (currentDay - index + 7) % 7;
        targetDate.setDate(now.getDate() - diff);
        targetDate.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(targetDate);
        nextDay.setDate(targetDate.getDate() + 1);

        const occupiedRooms = await this.prisma.booking.count({
          where: {
            hotelProfileId,
            status: BookingStatus.CHECKED_IN,
            checkInTime: { lte: nextDay },
            checkOutTime: { gte: targetDate },
          },
        });

        return {
          day,
          rate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
        };
      }),
    );

    return results;
  }
}
