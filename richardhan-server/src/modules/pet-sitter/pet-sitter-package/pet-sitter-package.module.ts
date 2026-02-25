import { Module } from '@nestjs/common';
import { PetSitterPackageService } from './pet-sitter-package.service';
import { PetSitterPackageController } from './pet-sitter-package.controller';

@Module({
  controllers: [PetSitterPackageController],
  providers: [PetSitterPackageService],
})
export class PetSitterPackageModule {}
