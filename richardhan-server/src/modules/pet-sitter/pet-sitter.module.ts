import { Module } from '@nestjs/common';
import { PetSitterService } from './pet-sitter.service';
import { PetSitterController } from './pet-sitter.controller';
import { PetSitterSettingsModule } from './pet-sitter-settings/pet-sitter-settings.module';

@Module({
  controllers: [PetSitterController],
  providers: [PetSitterService],
  imports: [PetSitterSettingsModule],
})
export class PetSitterModule {}
