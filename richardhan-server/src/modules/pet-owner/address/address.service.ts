import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateShippingAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateAddressDto) {
    return this.prisma.shippingAddress.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async findAll(userId: string) {
    const addresses = await this.prisma.shippingAddress.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return ApiResponse.success('Addresses found', addresses);
  }

  async findOne(userId: string, id: string) {
    const address = await this.prisma.shippingAddress.findUnique({
      where: { id },
    });

    if (!address) throw new NotFoundException();
    if (address.userId !== userId) throw new ForbiddenException();

    return ApiResponse.success('Address found', address);
  }

  async update(userId: string, id: string, dto: UpdateShippingAddressDto) {
    const address = await this.prisma.shippingAddress.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!address) throw new NotFoundException();
    if (address.userId !== userId) throw new ForbiddenException();

    const updatedAddress = await this.prisma.shippingAddress.update({
      where: { id: address.id },
      data: dto,
    });

    return ApiResponse.success('Address updated', updatedAddress);
  }

  async remove(userId: string, id: string) {
    const address = await this.prisma.shippingAddress.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!address) throw new NotFoundException();
    if (address.userId !== userId) throw new ForbiddenException();

    // prevent delete if used in an order
    const orderUsingAddress = await this.prisma.order.findFirst({
      where: {
        shippingAddressId: id,
        NOT: { status: 'CANCELLED' },
      },
    });

    if (orderUsingAddress) {
      throw new ForbiddenException('Address used in order cannot be deleted');
    }

    await this.prisma.shippingAddress.delete({
      where: { id: address.id },
    });

    return ApiResponse.success('Address deleted');
  }
}
