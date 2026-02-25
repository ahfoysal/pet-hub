import { Injectable } from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { getWeekNumber } from 'src/common/utils/date-range.util';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(vendorId: string) {
    const [
      totalProducts,
      totalStock,
      salesStats,
      ratingStats,
      customerGroups,
      paymentStats,
    ] = await Promise.all([
      this.prisma.product.count({
        where: { vendorId, isPublish: true },
      }),

      // Total Stock
      this.prisma.variant.aggregate({
        where: {
          product: { vendorId },
        },
        _sum: { stock: true },
      }),

      // Total Units Sold & Revenue
      this.prisma.orderItem.aggregate({
        where: {
          order: {
            vendorId,
            status: OrderStatus.DELIVERED,
            paymentStatus: PaymentStatus.SUCCESS,
          },
        },
        _sum: {
          quantity: true,
          totalPrice: true,
        },
      }),

      // Average Rating
      this.prisma.review.aggregate({
        where: {
          product: { vendorId },
        },
        _avg: { rating: true },
      }),

      // Total New Customers (Unique users who purchased)
      this.prisma.order.groupBy({
        by: ['userId'],
        where: {
          vendorId,
          status: OrderStatus.DELIVERED,
          paymentStatus: PaymentStatus.SUCCESS,
        },
      }),

      // Total Transactions & Total Payouts (Success payments)
      this.prisma.payment.aggregate({
        where: {
          order: { vendorId },
          status: PaymentStatus.SUCCESS,
        },
        _count: { id: true },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalProducts,
      totalStock: totalStock._sum.stock ?? 0,
      totalUnitsSold: salesStats._sum.quantity ?? 0,
      totalRevenue: salesStats._sum.totalPrice ?? 0,
      averageRating: Number(ratingStats._avg.rating?.toFixed(1)) || 0,
      totalNewCustomers: customerGroups.length,
      totalTransactions: paymentStats._count.id ?? 0,
      totalPayouts: paymentStats._sum.amount ?? 0,
    };
  }

  // Get vendor dashboard data
  async getVendorDashboard(
    vendorId: string,
    period: 'Daily' | 'Weekly' | 'Monthly' = 'Daily'
  ) {
    const [stats, charts] = await Promise.all([
      this.getStats(vendorId),
      this.getCharts(vendorId, period),
    ]);

    return ApiResponse.success('Dashboard data found', {
      ...stats,
      charts: charts.data,
    });
  }

  private getLabels(period: 'Daily' | 'Weekly' | 'Monthly'): string[] {
    const labels: string[] = [];
    const now = new Date();

    if (period === 'Daily') {
      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        labels.push(d.toISOString().slice(0, 10));
      }
    } else if (period === 'Weekly') {
      for (let i = 9; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i * 7);
        labels.push(`Week ${getWeekNumber(d)}`);
      }
    } else if (period === 'Monthly') {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(
          d.toLocaleString('default', { month: 'short' }) +
            ' ' +
            d.getFullYear()
        );
      }
    }
    return labels;
  }

  private getLabelForDate(
    date: Date,
    period: 'Daily' | 'Weekly' | 'Monthly'
  ): string {
    if (period === 'Daily') {
      return date.toISOString().slice(0, 10);
    } else if (period === 'Weekly') {
      return `Week ${getWeekNumber(date)}`;
    } else if (period === 'Monthly') {
      return (
        date.toLocaleString('default', { month: 'short' }) +
        ' ' +
        date.getFullYear()
      );
    }
    return '';
  }

  async getRevenueTrend(
    vendorId: string,
    period: 'Daily' | 'Weekly' | 'Monthly' = 'Daily'
  ) {
    let days = 14;
    if (period === 'Weekly') days = 70;
    if (period === 'Monthly') days = 365;

    const start = new Date();
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);

    const rows = await this.prisma.orderItem.findMany({
      where: {
        order: {
          vendorId,
          status: OrderStatus.DELIVERED,
          paymentStatus: PaymentStatus.SUCCESS,
          createdAt: { gte: start },
        },
      },
      select: {
        totalPrice: true,
        order: {
          select: { createdAt: true },
        },
      },
    });

    const labels = this.getLabels(period);
    const dataMap = new Map<string, number>();
    labels.forEach((l) => dataMap.set(l, 0));

    for (const row of rows) {
      const label = this.getLabelForDate(row.order.createdAt, period);
      if (dataMap.has(label)) {
        dataMap.set(label, (dataMap.get(label) || 0) + row.totalPrice);
      }
    }

    return {
      labels: [...dataMap.keys()],
      data: [...dataMap.values()],
    };
  }

  // Get units sold trend
  async getUnitsSoldTrend(
    vendorId: string,
    period: 'Daily' | 'Weekly' | 'Monthly' = 'Daily'
  ) {
    let days = 14;
    if (period === 'Weekly') days = 70;
    if (period === 'Monthly') days = 365;

    const start = new Date();
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);

    const rows = await this.prisma.orderItem.findMany({
      where: {
        order: {
          vendorId,
          status: OrderStatus.DELIVERED,
          paymentStatus: PaymentStatus.SUCCESS,
          createdAt: { gte: start },
        },
      },
      select: {
        quantity: true,
        order: {
          select: { createdAt: true },
        },
      },
      orderBy: {
        order: {
          createdAt: 'asc',
        },
      },
    });

    const labels = this.getLabels(period);
    const dataMap = new Map<string, number>();
    labels.forEach((l) => dataMap.set(l, 0));

    for (const row of rows) {
      const label = this.getLabelForDate(row.order.createdAt, period);
      if (dataMap.has(label)) {
        dataMap.set(label, (dataMap.get(label) || 0) + row.quantity);
      }
    }

    return {
      labels: [...dataMap.keys()],
      data: [...dataMap.values()],
    };
  }

  // Get average rating trend
  async getAverageRatingTrend(
    vendorId: string,
    period: 'Daily' | 'Weekly' | 'Monthly' = 'Daily'
  ) {
    let days = 42; // Default 6 weeks
    if (period === 'Daily') days = 14;
    if (period === 'Monthly') days = 365;

    const start = new Date();
    start.setDate(start.getDate() - days);

    const rows = await this.prisma.review.findMany({
      where: {
        product: { vendorId },
        createdAt: { gte: start },
      },
      select: {
        rating: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const labels = this.getLabels(period);
    const dataMap = new Map<string, { sum: number; count: number }>();
    labels.forEach((l) => dataMap.set(l, { sum: 0, count: 0 }));

    for (const r of rows) {
      const label = this.getLabelForDate(r.createdAt, period);
      const current = dataMap.get(label);
      if (current) {
        dataMap.set(label, {
          sum: current.sum + r.rating,
          count: current.count + 1,
        });
      }
    }

    return {
      labels: [...dataMap.keys()],
      data: [...dataMap.values()].map((v) =>
        v.count > 0 ? Number((v.sum / v.count).toFixed(1)) : 0
      ),
    };
  }

  // Get charts
  async getCharts(
    vendorId: string,
    period: 'Daily' | 'Weekly' | 'Monthly' = 'Daily'
  ) {
    const [revenue, unitsSold, rating] = await Promise.all([
      this.getRevenueTrend(vendorId, period),
      this.getUnitsSoldTrend(vendorId, period),
      this.getAverageRatingTrend(vendorId, period),
    ]);

    return ApiResponse.success('Charts found', {
      revenueChart: revenue,
      unitsSoldChart: unitsSold,
      ratingChart: rating,
    });
  }

  // Get best selling products
  async getBestSellingProducts(vendorId: string) {
    const items = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          vendorId,
          status: OrderStatus.DELIVERED,
          paymentStatus: PaymentStatus.SUCCESS,
        },
      },
      _sum: {
        quantity: true,
        totalPrice: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    const products = await this.prisma.product.findMany({
      where: {
        id: { in: items.map((i) => i.productId) },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p.name]));

    return items.map((item, i) => ({
      rank: i + 1,
      productId: item.productId,
      productName: productMap.get(item.productId),
      unitsSold: item._sum.quantity ?? 0,
      revenue: item._sum.totalPrice ?? 0,
    }));
  }

  // Get inventory summary
  async getInventorySummary(vendorId: string) {
    const LOW_STOCK_THRESHOLD = 5;

    const [stock, productStatus, avgRating, lowStock] = await Promise.all([
      // Stock
      this.prisma.variant.findMany({
        where: {
          product: { vendorId },
        },
        select: { stock: true },
      }),

      // Published / Unpublished
      this.prisma.product.groupBy({
        by: ['isPublish'],
        where: { vendorId },
        _count: true,
      }),

      // Average rating
      this.prisma.review.aggregate({
        where: {
          product: { vendorId },
        },
        _avg: { rating: true },
      }),

      // Low stock items
      this.prisma.variant.count({
        where: {
          product: { vendorId },
          stock: { lte: LOW_STOCK_THRESHOLD },
        },
      }),
    ]);

    const inStock = stock.filter((v) => v.stock > 0).length;
    const outOfStock = stock.filter((v) => v.stock === 0).length;

    const published =
      productStatus.find((p) => p.isPublish === true)?._count ?? 0;
    const unpublished =
      productStatus.find((p) => p.isPublish !== true)?._count ?? 0;

    return {
      inStock,
      outOfStock,
      published,
      unpublished,
      averageRating: Number(avgRating._avg.rating?.toFixed(1)) || 0,
      lowStockItems: lowStock,
    };
  }

  // Get recent activity
  async getRecentActivity(vendorId: string) {
    const [orders, products] = await Promise.all([
      this.prisma.order.findMany({
        where: { vendorId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          status: true,
          createdAt: true,
          orderItems: {
            take: 1,
            select: {
              product: { select: { name: true } },
              quantity: true,
            },
          },
        },
      }),

      this.prisma.product.findMany({
        where: { vendorId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    const activity = [
      ...orders.map((o) => ({
        type: 'ORDER',
        title: `New order #${o.id.slice(0, 6)}`,
        description: `${o.orderItems[0]?.product.name} (x${o.orderItems[0]?.quantity})`,
        status: o.status,
        time: o.createdAt,
      })),

      ...products.map((p) => ({
        type: 'PRODUCT',
        title:
          p.createdAt.getTime() === p.updatedAt.getTime()
            ? 'New product added'
            : 'Product updated',
        description: p.name,
        time: p.updatedAt,
      })),
    ]
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 6);

    return activity;
  }

  // Get analytics page data
  async getAnalyticsPageData(vendorId: string) {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [annualStats, totalOrders, completedOrders, charts] =
      await Promise.all([
        // Annual Revenue
        this.prisma.orderItem.aggregate({
          where: {
            order: {
              vendorId,
              status: OrderStatus.DELIVERED,
              paymentStatus: PaymentStatus.SUCCESS,
              createdAt: { gte: startOfYear },
            },
          },
          _sum: { totalPrice: true },
        }),

        // Total Orders (Bookings)
        this.prisma.order.count({
          where: {
            vendorId,
            createdAt: { gte: startOfYear },
          },
        }),

        // Completed Orders
        this.prisma.order.count({
          where: {
            vendorId,
            status: OrderStatus.DELIVERED,
            createdAt: { gte: startOfYear },
          },
        }),

        // Charts
        this.getCharts(vendorId, 'Monthly'),
      ]);

    const annualRevenue = annualStats._sum.totalPrice ?? 0;
    const avgCompletionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
    const avgSalesPerMonth = annualRevenue / (now.getMonth() + 1);

    return ApiResponse.success('Analytics data loaded', {
      stats: {
        totalOrders,
        annualRevenue,
        avgCompletionRate: Number(avgCompletionRate.toFixed(1)),
        avgSalesPerMonth: Number(avgSalesPerMonth.toFixed(1)),
      },
      charts: charts.data,
    });
  }

  // Get finance page data
  async getFinancePageData(vendorId: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { id: vendorId },
      select: { userId: true },
    });

    if (!vendor) {
      return ApiResponse.error('Vendor not found');
    }

    const [paymentHistory, pendingPaid, successPaid] = await Promise.all([
      // Detailed History
      this.prisma.payment.findMany({
        where: {
          receiverUserId: vendor.userId,
        },
        include: {
          order: {
            include: {
              user: {
                select: { fullName: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),

      // Pending Payouts
      this.prisma.payment.aggregate({
        where: {
          receiverUserId: vendor.userId,
          status: PaymentStatus.PENDING,
        },
        _sum: { amount: true },
      }),

      // Success/Released Payments
      this.prisma.payment.aggregate({
        where: {
          receiverUserId: vendor.userId,
          status: PaymentStatus.SUCCESS,
        },
        _sum: { amount: true },
      }),
    ]);

    return ApiResponse.success('Finance data loaded', {
      wallet: {
        released: successPaid._sum.amount ?? 0,
        pending: pendingPaid._sum.amount ?? 0,
        total: (successPaid._sum.amount ?? 0) + (pendingPaid._sum.amount ?? 0),
      },
      paymentHistory: paymentHistory.map((p) => ({
        id: p.id,
        orderId: p.orderId,
        customerName: p.order?.user?.fullName,
        amount: p.amount,
        status: p.status,
        date: p.createdAt,
      })),
    });
  }

  // Get inventory page data
  async getInventoryPageData(vendorId: string) {
    const [stats, bestSelling, inventory, recentActivity, detailedList] = await Promise.all([
      this.getStats(vendorId),
      this.getBestSellingProducts(vendorId),
      this.getInventorySummary(vendorId),
      this.getRecentActivity(vendorId),
      this.getInventoryDetailedList(vendorId),
    ]);

    return ApiResponse.success('Dashboard data loaded', {
      stats: stats,
      bestSellingProducts: bestSelling,
      inventorySummary: inventory,
      recentActivity: recentActivity,
      detailedList: detailedList,
    });
  }

  // Detailed list for inventory table
  async getInventoryDetailedList(vendorId: string) {
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        product: { vendorId },
      },
      include: {
        product: true,
        variant: true,
        order: {
          include: {
            user: {
              select: { fullName: true },
            },
          },
        },
      },
      orderBy: { order: { createdAt: 'desc' } },
      take: 50,
    });

    return orderItems.map((item) => ({
      orderId: item.orderId,
      productName: item.product.name,
      customerName: item.order.user.fullName,
      quantity: item.quantity,
      amount: item.totalPrice,
      date: item.order.createdAt,
      stock: item.variant.stock,
      status: item.order.status,
    }));
  }
}
