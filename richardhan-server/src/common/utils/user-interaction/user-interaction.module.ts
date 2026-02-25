import { Global, Module } from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [UserInteractionService],
  exports: [UserInteractionService],
})
export class UserInteractionModule {}
