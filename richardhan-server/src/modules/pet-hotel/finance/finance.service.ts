import { Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(hotelProfileId: string) {
    const [releasedPayments, pendingPayout, totalCompleted] = await Promise.all([
      // Released = CHECKED_OUT bookings (completed stays with payment released)
      this.prisma.booking.aggregate({
        where: {
          hotelProfileId,
          status: BookingStatus.CHECKED_OUT,
        },
        _sum: { grandTotal: true },
        _count: { _all: true },
      }),
      // Pending = CONFIRMED or CHECKED_IN bookings (guests still active or awaiting payout)
      this.prisma.booking.aggregate({
        where: {
          hotelProfileId,
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN] },
        },
        _sum: { grandTotal: true },
      }),
      // Total completed bookings
      this.prisma.booking.count({
        where: {
          hotelProfileId,
          status: BookingStatus.CHECKED_OUT,
        },
      }),
    ]);

    return ApiResponse.success('Finance overview retrieved', {
      releasedPayments: releasedPayments._sum.grandTotal ?? 0,
      releasedCount: releasedPayments._count._all,
      pendingPayout: pendingPayout._sum.grandTotal ?? 0,
      totalCompletedBookings: totalCompleted,
    });
  }

  async getHistory(hotelProfileId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          hotelProfileId,
          status: { not: BookingStatus.CANCELLED },
        },
        include: {
          user: { select: { fullName: true, image: true } },
          room: { select: { roomName: true, roomNumber: true, roomType: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({
        where: {
          hotelProfileId,
          status: { not: BookingStatus.CANCELLED },
        },
      }),
    ]);

    const history = bookings.map((b) => ({
      id: b.id,
      guestName: b.user.fullName,
      guestImage: b.user.image,
      date: b.createdAt,
      checkIn: b.checkInTime,
      checkOut: b.checkOutTime,
      amount: b.grandTotal,
      status: b.status,
      roomType: b.room?.roomType || 'N/A',
      roomNumber: b.room?.roomNumber || 'N/A',
    }));

    return ApiResponse.success('Payment history retrieved', {
      data: history,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  async getTimeline(hotelProfileId: string) {
    const now = new Date();
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
      const date = subMonths(now, i);
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
        label: format(date, 'MMM yyyy'),
      };
    }).reverse();

    const timeline = await Promise.all(
      last6Months.map(async (month) => {
        const [released, pending] = await Promise.all([
          this.prisma.booking.aggregate({
            where: {
              hotelProfileId,
              status: BookingStatus.CHECKED_OUT,
              updatedAt: { gte: month.start, lte: month.end },
            },
            _sum: { grandTotal: true },
          }),
          this.prisma.booking.aggregate({
            where: {
              hotelProfileId,
              status: { in: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN] },
              createdAt: { gte: month.start, lte: month.end },
            },
            _sum: { grandTotal: true },
          }),
        ]);

        return {
          month: month.label,
          released: released._sum.grandTotal ?? 0,
          pending: pending._sum.grandTotal ?? 0,
        };
      }),
    );

    return ApiResponse.success('Payment timeline retrieved', timeline);
  }
}
