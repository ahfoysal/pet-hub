import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { FriendshipService } from './friendship/friendship.service';

@Module({
  controllers: [CommunityController],
  providers: [CommunityService, FriendshipService],
})
export class CommunityModule {}
