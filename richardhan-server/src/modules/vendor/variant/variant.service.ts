import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class VariantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(dto: CreateVariantDto, files: Express.Multer.File[]) {
    const uploadedImages =
      await this.cloudinaryService.uploadMultipleFiles(files);
    const imageUrls = uploadedImages.map((img) => img.secure_url);

    return this.prisma.$transaction(async (tx) => {
      const variant = await tx.variant.create({
        data: {
          productId: dto.productId,
          originalPrice: dto.originalPrice,
          sellingPrice: dto.sellingPrice,
          images: imageUrls,
          attributes: dto.attributes,
          stock: dto.stock,
          sku: dto.sku,
        },
      });

      // Create VariantAttribute index
      const attributeEntries = Object.entries(dto.attributes || {}).map(
        ([key, value]) => ({
          variantId: variant.id,
          key,
          value: String(value),
        })
      );

      if (attributeEntries.length > 0) {
        await tx.variantAttribute.createMany({
          data: attributeEntries,
        });
      }

      return ApiResponse.success('Variant created', variant);
    });
  }

  async getProductWithVariant(productId: string, variantId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
      },
      include: {
        variants: {
          where: { id: variantId },
          // include: {
          //   attributeIndex: {
          //     select: {
          //       key: true,
          //       value: true,
          //     },
          //   },
          // },
        },
      },
    });

    if (!product || product.variants.length === 0) {
      return ApiResponse.error('Product or variant not found');
    }

    return ApiResponse.success('Product fetched successfully', {
      ...product,
      variants: product.variants[0],
    });
  }

  async updateVariant(
    variantId: string,
    dto: UpdateVariantDto,
    files?: Express.Multer.File[]
  ) {
    const uploadedImages = files?.length
      ? await this.cloudinaryService.uploadMultipleFiles(files)
      : [];

    const newImageUrls = uploadedImages.map((img) => img.secure_url);

    return this.prisma.$transaction(async (tx) => {
      const variant = await tx.variant.findUnique({
        where: { id: variantId },
      });

      if (!variant) {
        throw new NotFoundException('Variant not found');
      }

      const images = [...(dto.prevImages ?? variant.images), ...newImageUrls];

      const updatedVariant = await tx.variant.update({
        where: { id: variantId },
        data: {
          originalPrice: dto.originalPrice,
          sellingPrice: dto.sellingPrice,
          stock: dto.stock,
          images,
          attributes:
            dto.attributes ??
            (variant.attributes !== null ? variant.attributes : undefined),
          sku: dto.sku,
        },
      });

      if (dto.attributes) {
        await tx.variantAttribute.deleteMany({
          where: { variantId },
        });

        const attributeEntries = Object.entries(dto.attributes).map(
          ([key, value]) => ({
            variantId,
            key,
            value: String(value),
          })
        );

        if (attributeEntries.length) {
          await tx.variantAttribute.createMany({
            data: attributeEntries,
          });
        }
      }

      return ApiResponse.success(
        'Variant updated successfully',
        updatedVariant
      );
    });
  }
}
