import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(
    dto: CreateProductDto,
    vendorId: string,
    files: Express.Multer.File[]
  ) {
    const uploadedImages =
      await this.cloudinaryService.uploadMultipleFiles(files);
    const imageUrls = uploadedImages.map((img) => img.secure_url);

    const result = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        petCategory: dto.petCategory,
        tags: dto.tags,
        features: dto.features,
        productCategory: dto.category,
        vendorId,
        images: imageUrls,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
      },
    });
    return ApiResponse.success('Product created successfully', result);
  }

  async getAllProducts(
    page: number = 1,
    limit: number = 10,
    productId?: string
  ) {
    if (productId) {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: {
          variants: true,
          vendor: {
            select: {
              id: true,
              userId: true,
              name: true,
              email: true,
              phone: true,
              description: true,
              images: true,
            },
          },
        },
      });

      if (!product) {
        return ApiResponse.error('Product not found', 404);
      }

      return ApiResponse.success('Product found', product);
    }

    const skip = (page - 1) * limit;

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          variants: true,
          vendor: {
            select: {
              id: true,
              userId: true,
              name: true,
              email: true,
              phone: true,
              description: true,
              images: true,
            },
          },
        },
      }),
      this.prisma.product.count(),
    ]);

    const hasNext = page * limit < total;
    const hasPrev = page > 1;

    return ApiResponse.success('Products found', {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext,
        hasPrev,
      },
    });
  }

  async getMyProducts(
    vendorId: string,
    query: PaginationQueryDto
  ) {
    const { page = 1, limit = 10, search, category, isPublish, sku, sortBy = 'createdAt', order = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = { vendorId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.productCategory = category;
    }

    if (isPublish !== undefined) {
      where.isPublish = isPublish;
    }

    if (sku) {
      where.variants = {
        some: {
          sku: { contains: sku, mode: 'insensitive' },
        },
      };
    }

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          variants: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const hasNext = page * limit < total;
    const hasPrev = page > 1;

    return ApiResponse.success('Products found', {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext,
        hasPrev,
      },
    });
  }

  async updateProduct(
    productId: string,
    dto: UpdateProductDto,
    files?: Express.Multer.File[]
  ) {
    return this.prisma.$transaction(async (tx) => {
      const uploadedImages = files?.length
        ? await this.cloudinaryService.uploadMultipleFiles(files)
        : [];

      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return ApiResponse.error('Product not found');
      }

      const newImageUrls = uploadedImages.map((img) => img.secure_url);

      const images =
        dto.images !== undefined
          ? [...dto.images, ...newImageUrls]
          : [...product.images, ...newImageUrls];

      const updateData: any = {};

      if (dto.name) updateData.name = dto.name;
      if (dto.description) updateData.description = dto.description;
      if (dto.tags?.length) updateData.tags = dto.tags;
      if (dto.features?.length) updateData.features = dto.features;
      if (images.length) updateData.images = images;
      if (dto.seoTitle) updateData.seoTitle = dto.seoTitle;
      if (dto.seoDescription) updateData.seoDescription = dto.seoDescription;

      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: updateData,
      });

      return ApiResponse.success(
        'Product updated successfully',
        updatedProduct
      );
    });
  }

  async deleteProduct(productId: string, vendorId: string) {
    const result = await this.prisma.product.delete({
      where: { id: productId, vendorId },
    });

    return ApiResponse.success('Product deleted successfully', result.id);
  }

  async togglePublish(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return ApiResponse.error('Product not found');
    }

    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: { isPublish: !product.isPublish },
    });

    return ApiResponse.success(
      `Product ${updated.isPublish ? 'published' : 'unpublished'}`,
      updated
    );
  }
}
