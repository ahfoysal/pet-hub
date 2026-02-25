import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { CurrentVendor } from 'src/common/decorators/current-vendor.decorator';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { RequireVerifiedProfile } from 'src/common/decorators/require-verified-profile.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { VerifiedProfileGuard } from 'src/common/guards/verified-profile.guard';
import { Role } from 'src/common/types/auth.types';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderService } from './order.service';

@UseGuards(AuthGuard, VerifiedProfileGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Checkout
  @ApiOperation({ summary: 'Create order' })
  @Roles(Role.PET_OWNER)
  @Post()
  createOrder(@CurrentUser('id') id: string, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(id, dto);
  }

  // User orders
  @ApiOperation({ summary: 'Get user orders' })
  @Roles(Role.PET_OWNER)
  @Get('owner')
  getMyOrders(@CurrentUser('id') id: string) {
    return this.orderService.getUserOrders(id);
  }

  @ApiOperation({ summary: 'Get vendor orders' })
  @RequireVerifiedProfile()
  @Roles(Role.VENDOR)
  @Get('vendor')
  getVendorOrders(
    @CurrentVendor('id') vendorId: string,
    @Query('status') status?: OrderStatus,
    @Query('search') search?: string
  ) {
    return this.orderService.getVendorOrders(vendorId, status, search);
  }

  @ApiOperation({ summary: 'Get order detail' })
  @RequireVerifiedProfile()
  @Roles(Role.VENDOR)
  @Get(':id')
  getOrderDetail(
    @CurrentVendor('id') vendorId: string,
    @Param('id') orderId: string
  ) {
    return this.orderService.getOrderById(orderId, vendorId);
  }

  @ApiOperation({ summary: 'Update order status' })
  @RequireVerifiedProfile()
  @Roles(Role.VENDOR)
  @Patch(':id/status')
  updateStatus(
    @CurrentVendor('id') vendorId: string,
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderStatusDto
  ) {
    return this.orderService.updateOrderStatus(vendorId, orderId, dto.status);
  }
}
