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
import { ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CurrentVendor } from 'src/common/decorators/current-vendor.decorator';
import { RequireVerifiedProfile } from 'src/common/decorators/require-verified-profile.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileGuard } from 'src/common/guards/profile.guard';
import { VerifiedProfileGuard } from 'src/common/guards/verified-profile.guard';
import { Role } from 'src/common/types/auth.types';
import { storageConfig } from 'src/config/storage.config';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create product' })
  @UseGuards(AuthGuard, VerifiedProfileGuard)
  @RequireVerifiedProfile()
  @Roles(Role.VENDOR)
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentVendor('id') vendorId: string,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return await this.productService.create(createProductDto, vendorId, files);
  }

  @ApiOperation({ summary: 'Get my products' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @UseGuards(AuthGuard, VerifiedProfileGuard)
  @RequireVerifiedProfile()
  @Roles(Role.VENDOR)
  @Get('my-products')
  async getMyProducts(
    @CurrentVendor('id') vendorId: string,
    @Query() query: PaginationQueryDto
  ) {
    return await this.productService.getMyProducts(vendorId, query);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  async getAllProducts(
    @Query('productId') productId?: string,
    @Query() query?: PaginationQueryDto
  ) {
    return await this.productService.getAllProducts(
      query?.page,
      query?.limit,
      productId
    );
  }

  @ApiOperation({ summary: 'Update my product' })
  @UseGuards(AuthGuard, VerifiedProfileGuard)
  @RequireVerifiedProfile()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  @Roles(Role.VENDOR)
  @Patch(':id')
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') productId: string
  ) {
    return await this.productService.updateProduct(
      productId,
      updateProductDto,
      files
    );
  }

  @ApiOperation({ summary: 'Delete my product' })
  @UseGuards(AuthGuard, ProfileGuard)
  @RequireVerifiedProfile()
  @Roles(Role.VENDOR)
  @Delete(':id')
  async deleteProduct(
    @Param('id') productId: string,
    @CurrentVendor('id') vendorId: string
  ) {
    return await this.productService.deleteProduct(productId, vendorId);
  }

  @ApiOperation({ summary: 'Toggle product publish status' })
  @UseGuards(AuthGuard, VerifiedProfileGuard)
  @RequireVerifiedProfile()
  @Roles(Role.VENDOR)
  @Patch(':id/toggle-publish')
  async togglePublish(@Param('id') productId: string) {
    return await this.productService.togglePublish(productId);
  }
}
