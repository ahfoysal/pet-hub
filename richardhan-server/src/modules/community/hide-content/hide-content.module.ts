import { Module } from '@nestjs/common';
import { HideContentService } from './hide-content.service';
import { HideContentController } from './hide-content.controller';

@Module({
  controllers: [HideContentController],
  providers: [HideContentService],
})
export class HideContentModule {}
