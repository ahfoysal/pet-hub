import { Module } from '@nestjs/common';
import { UserMuteService } from './user-mute.service';
import { UserMuteController } from './user-mute.controller';

@Module({
  controllers: [UserMuteController],
  providers: [UserMuteService],
})
export class UserMuteModule {}
