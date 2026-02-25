import { PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';

export class UpdateShippingAddressDto extends PartialType(CreateAddressDto) {}
