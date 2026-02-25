import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  // Get or create cart
  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    return cart;
  }

  async addItem(userId: string, dto: AddToCartDto) {
    const { productId, variantId, quantity } = dto;

    return this.prisma.$transaction(async (tx) => {
      const cart = await this.getOrCreateCart(userId);

      const variant = await tx.variant.findUnique({
        where: { id: variantId, productId },
        include: { product: true },
      });

      if (!variant) {
        throw new BadRequestException('Invalid product or variant');
      }

      if (variant.stock < quantity) {
        throw new BadRequestException('Out of stock');
      }

      const existingItem = await tx.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
          variantId,
        },
      });

      const unitPrice = variant.sellingPrice;

      if (existingItem) {
        return tx.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity,
            totalPrice: (existingItem.quantity + quantity) * unitPrice,
          },
        });
      }
      const item = await tx.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
        },
      });

      return ApiResponse.success('Item added to cart', item);
    });
  }

  // Update quantity
  async updateItemQuantity(
    userId: string,
    cartItemId: string,
    quantity: number
  ) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true, variant: true },
    });

    if (!item) throw new NotFoundException();
    if (item.cart.userId !== userId) throw new ForbiddenException();
    if (item.variant.stock < quantity)
      throw new BadRequestException('Out of stock');

    const updatedItem = await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity,
        totalPrice: item.unitPrice * quantity,
      },
    });

    return ApiResponse.success('Item quantity updated', updatedItem);
  }

  // Get cart
  async getCart(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
    return ApiResponse.success('Cart found', cart);
  }

  // Remove item
  async removeItem(userId: string, cartItemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!item) throw new NotFoundException();
    if (item.cart.userId !== userId) throw new ForbiddenException();

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return ApiResponse.success('Item removed from cart');
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) return;

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return ApiResponse.success('Cart cleared');
  }
}
