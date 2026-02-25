import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentHotel } from 'src/common/decorators/current-hotel.decorator';
import { RequireVerifiedProfile } from 'src/common/decorators/require-verified-profile.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { VerifiedProfileGuard } from 'src/common/guards/verified-profile.guard';
import { Role } from 'src/common/types/auth.types';
import { storageConfig } from 'src/config/storage.config';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FoodService } from './food.service';

@ApiTags('Pet Hotel - Food')
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @ApiOperation({ summary: 'Get my foods by hotel owner' })
  @UseGuards(AuthGuard, VerifiedProfileGuard)
  @RequireVerifiedProfile()
  @Get('my-foods')
  getMyFoods(@CurrentHotel('id') hotelId: string) {
    return this.foodService.getMyFoods(hotelId);
  }

  @ApiOperation({ summary: 'Get all foods' })
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getAllFoods(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.foodService.getAllFoods(page, limit);
  }

  @ApiOperation({ summary: 'Get single food' })
  @Get(':id')
  getSingleFood(@Param('id') foodId: string) {
    return this.foodService.getSingleFood(foodId);
  }

  @ApiOperation({ summary: 'Create food by hotel' })
  @Roles(Role.PET_HOTEL)
  @UseGuards(AuthGuard, VerifiedProfileGuard)
  @RequireVerifiedProfile()
  @UseInterceptors(FilesInterceptor('files', 10, { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  @Post()
  create(
    @Body() createFoodDto: CreateFoodDto,
    @CurrentHotel('id') hotelId: string,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    // return console.log(createFoodDto);
    return this.foodService.create(createFoodDto, hotelId, files);
  }

  @ApiOperation({ summary: 'Update food by hotel owner' })
  @Roles(Role.PET_HOTEL)
  @UseGuards(AuthGuard, VerifiedProfileGuard)
  @RequireVerifiedProfile()
  @UseInterceptors(FilesInterceptor('files', 10, { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  updateFood(
    @Body() dto: UpdateFoodDto,
    @Param('id') foodId: string,
    @CurrentHotel('id') hotelId: string,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    return this.foodService.updateFood(foodId, hotelId, dto, files);
  }

  @ApiOperation({ summary: 'Delete food by hotel owner' })
  @Roles(Role.PET_HOTEL)
  @UseGuards(AuthGuard, VerifiedProfileGuard)
  @RequireVerifiedProfile()
  @Delete(':id')
  removeFood(@Param('id') foodId: string, @CurrentHotel('id') hotelId: string) {
    return this.foodService.removeFood(foodId, hotelId);
  }
}
