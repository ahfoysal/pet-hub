import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireVerifiedProfile } from 'src/common/decorators/require-verified-profile.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { VerifiedProfileGuard } from 'src/common/guards/verified-profile.guard';
import { Role } from 'src/common/types/auth.types';
import { storageConfig } from 'src/config/storage.config';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { VariantService } from './variant.service';

@ApiTags('Product')
@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @ApiOperation({ summary: 'Create Variant' })
  @UseGuards(AuthGuard, VerifiedProfileGuard)
  @RequireVerifiedProfile()
  @Roles(Role.VENDOR)
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  @Post()
  async create(
    @Body() dto: CreateVariantDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return await this.variantService.create(dto, files);
  }

  @ApiOperation({ summary: 'Get Product With Variant' })
  @Get(':productId/:variantId')
  async getProductWithVariant(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string
  ) {
    return await this.variantService.getProductWithVariant(
      productId,
      variantId
    );
  }

  @ApiOperation({ summary: 'Update Variant' })
  @UseGuards(AuthGuard, VerifiedProfileGuard)
  @RequireVerifiedProfile()
  @Roles(Role.VENDOR)
  @Patch(':variantId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  async updateVariant(
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    // return console.log(dto, files);
    return await this.variantService.updateVariant(variantId, dto, files);
  }
}
