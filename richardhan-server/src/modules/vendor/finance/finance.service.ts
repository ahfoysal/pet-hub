import { Injectable } from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { FinanceQueryDto, FinanceStatus } from './dto/finance-query.dto';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(vendorId: string) {
    const [releasedPayments, pendingPayout, totalCompleted] = await Promise.all([
      // Released = DELIVERED orders with SUCCESS payment
      this.prisma.order.aggregate({
        where: {
          vendorId,
          status: OrderStatus.DELIVERED,
          paymentStatus: PaymentStatus.SUCCESS,
        },
        _sum: { grandTotal: true },
      }),
      // Pending = CONFIRMED/PACKING/SHIPPED orders with SUCCESS payment
      this.prisma.order.aggregate({
        where: {
          vendorId,
          status: { in: [OrderStatus.CONFIRMED, OrderStatus.PACKING, OrderStatus.SHIPPED] },
          paymentStatus: PaymentStatus.SUCCESS,
        },
        _sum: { grandTotal: true },
      }),
      // Total completed orders count
      this.prisma.order.count({
        where: {
          vendorId,
          status: OrderStatus.DELIVERED,
        },
      }),
    ]);

    return ApiResponse.success('Finance overview retrieved', {
      releasedPayments: releasedPayments._sum.grandTotal ?? 0,
      pendingPayout: pendingPayout._sum.grandTotal ?? 0,
      totalCompletedOrders: totalCompleted,
    });
  }

  async getHistory(vendorId: string, query: FinanceQueryDto) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where: any = { vendorId };

    if (status) {
      if (status === FinanceStatus.RELEASED) {
        where.status = OrderStatus.DELIVERED;
        where.paymentStatus = PaymentStatus.SUCCESS;
      } else if (status === FinanceStatus.PENDING) {
        where.status = { in: [OrderStatus.CONFIRMED, OrderStatus.PACKING, OrderStatus.SHIPPED] };
        where.paymentStatus = PaymentStatus.SUCCESS;
      } else if (status === FinanceStatus.HOLD) {
          where.paymentStatus = PaymentStatus.PENDING;
      } else if (status === FinanceStatus.CANCELLED) {
        where.status = OrderStatus.CANCELLED;
      }
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          user: { select: { fullName: true, image: true } },
          orderItems: { select: { id: true, product: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    const history = orders.map((order) => {
      let mappedStatus = 'PENDING';
      if (order.status === OrderStatus.DELIVERED && order.paymentStatus === PaymentStatus.SUCCESS) {
        mappedStatus = 'RELEASED';
      } else if (order.status === OrderStatus.CANCELLED) {
        mappedStatus = 'CANCELLED';
      } else if (order.paymentStatus === PaymentStatus.PENDING) {
        mappedStatus = 'HOLD';
      }

      return {
        id: order.id,
        orderId: `#${order.id.slice(-6).toUpperCase()}`,
        customerName: order.user.fullName,
        customerImage: order.user.image,
        productName: order.orderItems[0]?.product?.name || 'Multiple Products',
        amount: order.grandTotal,
        date: order.createdAt,
        status: mappedStatus,
        // Release date estimation (e.g., 3 days after delivery)
        releaseDate: order.status === OrderStatus.DELIVERED ? new Date(order.updatedAt.getTime() + 3 * 24 * 60 * 60 * 1000) : null,
      };
    });

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getTimeline(vendorId: string) {
    // This provides a high-level overview of the payment steps as per Figma
    return await Promise.resolve(ApiResponse.success('Payment timeline retrieved', [
      {
        id: 1,
        title: 'Order Completed',
        description: 'Product delivered and received by customer',
        status: 'COMPLETED',
      },
      {
        id: 2,
        title: 'Super Admin Review',
        description: 'Admin verifies order fulfillment and period for returns',
        status: 'IN_PROGRESS',
      },
      {
        id: 3,
        title: 'Payment Released',
        description: 'Funds transferred to your vendor wallet',
        status: 'PENDING',
      },
    ]));
  }
}
