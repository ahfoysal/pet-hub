import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      // Fetch selected cart items
      const cartItems = await tx.cartItem.findMany({
        where: {
          id: { in: dto.cartItemIds },
          cart: { userId },
        },
        include: {
          product: true,
          variant: true,
          cart: true,
        },
      });

      if (cartItems.length !== dto.cartItemIds.length) {
        throw new ForbiddenException('Invalid cart items selected');
      }

      // Ensure all items belong to ONE vendor
      const vendorIds = new Set(cartItems.map((i) => i.product.vendorId));

      if (vendorIds.size !== 1) {
        throw new BadRequestException('Items must belong to one vendor');
      }

      const vendorId = cartItems[0].product.vendorId;

      // Validate stock & calculate subtotal
      let subTotal = 0;

      for (const item of cartItems) {
        if (item.variant.stock < item.quantity) {
          throw new BadRequestException(`Out of stock: ${item.product.name}`);
        }
        subTotal += item.totalPrice;
      }

      const platformFee = subTotal * 0.02;
      const grandTotal = subTotal + platformFee;

      // Create Order
      const order = await tx.order.create({
        data: {
          userId,
          vendorId,
          cartId: cartItems[0].cartId,
          shippingAddressId: dto.shippingAddressId,
          subTotal,
          platformFee,
          grandTotal,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          orderItems: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.unitPrice,
              totalPrice: item.totalPrice,
            })),
          },
        },
      });

      // Reduce stock
      for (const item of cartItems) {
        await tx.variant.update({
          where: { id: item.variantId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      // Remove ONLY selected cart items
      await tx.cartItem.deleteMany({
        where: {
          id: { in: dto.cartItemIds },
        },
      });

      return ApiResponse.success('Order created', order);
    });
  }

  async getUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: true,
        shippingAddress: true,
        vendor: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return ApiResponse.success('Orders found', orders);
  }

  async getVendorOrders(vendorId: string, status?: OrderStatus, search?: string) {
    const where: any = { vendorId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { user: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            image: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return ApiResponse.success('Orders found', orders);
  }

  async getOrderById(orderId: string, vendorId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId, vendorId },
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            image: true,
          },
        },
        vendor: true,
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return ApiResponse.success('Order found', order);
  }

  async updateOrderStatus(vendorId: string, orderId: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.vendorId !== vendorId) {
      throw new ForbiddenException('Not authorized to update this order');
    }

    // Logical progression validation (optional but good)
    // e.g., Shipped cannot go back to Pending
    
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return ApiResponse.success('Order status updated', updatedOrder);
  }
}
