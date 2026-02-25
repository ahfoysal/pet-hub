import { Module } from '@nestjs/common';
import { PetOwnerService } from './pet-owner.service';
import { PetOwnerController } from './pet-owner.controller';
import { CartModule } from './cart/cart.module';
import { AddressModule } from './address/address.module';

@Module({
  controllers: [PetOwnerController],
  providers: [PetOwnerService],
  imports: [CartModule, AddressModule],
})
export class PetOwnerModule {}
