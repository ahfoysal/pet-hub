import { Module } from '@nestjs/common';
import { SavedPetSitterService } from './saved-pet-sitter.service';
import { SavedPetSitterController } from './saved-pet-sitter.controller';

@Module({
  controllers: [SavedPetSitterController],
  providers: [SavedPetSitterService],
})
export class SavedPetSitterModule {}
