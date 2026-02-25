import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class RoomAvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  // Generate availability calendar for a room
  async generateCalender(roomId: string, days: number = 180) {
    const startDate = new Date();

    const data = Array.from({ length: days }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      return {
        roomId,
        date,
        isAvailable: true,
      };
    });

    await this.prisma.roomAvailability.createMany({
      data,
      skipDuplicates: true,
    });
  }

  /** Number of nights for a stay (checkOut is exclusive: e.g. 20–25 = 5 nights). */
  getTotalNights(checkIn: Date, checkOut: Date): number {
    return Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Check if room is available for date range [checkIn, checkOut) – checkOut exclusive
  async checkAvailability(roomId: string, checkIn: Date, checkOut: Date) {
    const totalNights = this.getTotalNights(checkIn, checkOut);

    const availableDays = await this.prisma.roomAvailability.findMany({
      where: {
        roomId,
        date: {
          gte: checkIn,
          lt: checkOut,
        },
        isAvailable: true,
      },
    });

    return {
      totalNights,
      availableNights: availableDays.length,
      isAvailable: availableDays.length === totalNights,
    };
  }

  /** Get availability rows for a room in [checkIn, checkOut) for price calculation. */
  async getAvailabilityForRange(
    roomId: string,
    checkIn: Date,
    checkOut: Date
  ): Promise<{ priceOverride: number | null }[]> {
    return this.prisma.roomAvailability.findMany({
      where: {
        roomId,
        date: { gte: checkIn, lt: checkOut },
        isAvailable: true,
      },
      select: { priceOverride: true },
      orderBy: { date: 'asc' },
    });
  }

  /**
   * Search rooms available for the full date range [checkIn, checkOut).
   * Optionally filter by hotelId.
   */
  async searchAvailableRooms(
    checkIn: Date,
    checkOut: Date,
    hotelId?: string
  ): Promise<
    {
      room: any;
      totalNights: number;
      totalPrice: number;
      pricePerNight: number;
    }[]
  > {
    const totalNights = this.getTotalNights(checkIn, checkOut);
    if (totalNights < 1) return [];

    const availabilityRows = await this.prisma.roomAvailability.findMany({
      where: {
        date: { gte: checkIn, lt: checkOut },
        isAvailable: true,
      },
      select: { roomId: true, priceOverride: true },
    });

    // Group by roomId; keep only rooms that have all nights available
    const byRoom = new Map<
      string,
      { priceOverride: number | null }[]
    >();
    for (const row of availabilityRows) {
      const list = byRoom.get(row.roomId) ?? [];
      list.push({ priceOverride: row.priceOverride });
      byRoom.set(row.roomId, list);
    }

    const roomIdsWithFullAvailability = Array.from(byRoom.entries())
      .filter(([, days]) => days.length === totalNights)
      .map(([roomId]) => roomId);

    if (roomIdsWithFullAvailability.length === 0) return [];

    const rooms = await this.prisma.room.findMany({
      where: {
        id: { in: roomIdsWithFullAvailability },
        ...(hotelId && { hotelProfileId: hotelId }),
      },
      include: {
        hotelProfile: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            rating: true,
            reviewCount: true,
            images: true,
          },
        },
      },
    });

    return rooms.map((room) => {
      const availability = byRoom.get(room.id)!;
      const totalPrice = this.calculateTotalPrice(
        availability,
        room.price
      );
      return {
        room,
        totalNights,
        totalPrice,
        pricePerNight: Math.round(totalPrice / totalNights),
      };
    });
  }

  // Calculate total price for selected dates
  calculateTotalPrice(
    availability: { priceOverride: number | null }[],
    basePrice: number
  ) {
    return availability.reduce((total, day) => {
      return total + (day.priceOverride ?? basePrice);
    }, 0);
  }

  // Lock room dates after booking confirmation
  async lockDates(roomId: string, checkIn: Date, checkOut: Date) {
    await this.prisma.roomAvailability.updateMany({
      where: {
        roomId,
        date: {
          gte: checkIn,
          lt: checkOut,
        },
      },
      data: {
        isAvailable: false,
      },
    });
  }

  // Unlock room dates after cancellation / expiry
  async unlockDates(roomId: string, checkIn: Date, checkOut: Date) {
    await this.prisma.roomAvailability.updateMany({
      where: {
        roomId,
        date: {
          gte: checkIn,
          lt: checkOut,
        },
      },
      data: {
        isAvailable: true,
      },
    });
  }

  async updateCalendar(
    roomId: string,
    from: Date,
    to: Date,
    data: {
      priceOverride?: number | null;
      isAvailable?: boolean;
    }
  ) {
    await this.prisma.roomAvailability.updateMany({
      where: {
        roomId,
        date: {
          gte: from,
          lte: to,
        },
      },
      data,
    });
  }
}
