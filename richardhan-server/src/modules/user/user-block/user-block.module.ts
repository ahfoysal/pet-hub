import { Global, Module } from '@nestjs/common';
import { UserBlockService } from './user-block.service';
import { UserBlockController } from './user-block.controller';

@Global()
@Module({
  controllers: [UserBlockController],
  providers: [UserBlockService],
  exports: [UserBlockService],
})
export class UserBlockModule {}
