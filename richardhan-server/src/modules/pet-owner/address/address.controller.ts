import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateShippingAddressDto } from './dto/update-address.dto';

@UseGuards(AuthGuard)
@ApiTags('Shipping Address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiOperation({ summary: 'Create shipping address' })
  @Post()
  create(@CurrentUser('id') id: string, @Body() dto: CreateAddressDto) {
    return this.addressService.create(id, dto);
  }

  @ApiOperation({ summary: 'Get all shipping addresses for user' })
  @Get()
  findAll(@CurrentUser('id') id: string) {
    return this.addressService.findAll(id);
  }

  @ApiOperation({ summary: 'Get shipping address by id' })
  @Get(':addressId')
  findOne(
    @CurrentUser('id') id: string,
    @Param('addressId') addressId: string
  ) {
    return this.addressService.findOne(id, addressId);
  }

  @ApiOperation({ summary: 'Update shipping address' })
  @Patch(':addressId')
  update(
    @CurrentUser('id') id: string,
    @Param('addressId') addressId: string,
    @Body() dto: UpdateShippingAddressDto
  ) {
    return this.addressService.update(id, addressId, dto);
  }

  @ApiOperation({ summary: 'Delete shipping address' })
  @Delete(':addressId')
  remove(@CurrentUser('id') id: string, @Param('addressId') addressId: string) {
    return this.addressService.remove(id, addressId);
  }
}
