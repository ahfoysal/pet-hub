import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/common/utils/cloudinary/cloudinary.module';
import { PetSitterSettingsController } from './pet-sitter-settings.controller';
import { PetSitterSettingsService } from './pet-sitter-settings.service';

@Module({
  imports: [CloudinaryModule],
  controllers: [PetSitterSettingsController],
  providers: [PetSitterSettingsService],
})
export class PetSitterSettingsModule {}
