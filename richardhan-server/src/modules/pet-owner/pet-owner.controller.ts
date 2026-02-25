import { Controller } from '@nestjs/common';
import { PetOwnerService } from './pet-owner.service';

@Controller('pet-owner')
export class PetOwnerController {
  constructor(private readonly petOwnerService: PetOwnerService) {}

  // @ApiOperation({ summary: 'Hotel Profile Setup' })
  // @UseGuards(AuthGuard)
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  // @Post('profile-setup')
  // async profileSetup(
  //   @Body() dto: CreatePetOwnerDto,
  //   @CurrentUser() user: User,
  //   @UploadedFiles() file: Express.Multer.File
  // ) {
  //   return await this.petOwnerService.profileSetup(dto, user, file);
  // }
}
