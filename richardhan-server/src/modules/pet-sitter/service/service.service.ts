import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { ApiResponse } from 'src/common/response/api-response';
import { Prisma, Service } from '@prisma/client';
import { generateUniqueId } from 'src/common/utils/generateUniqueIds';

@Injectable()
export class ServiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService
  ) {}

  // async createService(
  //   userId: string,
  //   payload: CreateServiceDto,
  //   file?: Express.Multer.File
  // ) {
  //   if (!file) {
  //     throw new BadRequestException('File is required');
  //   }

  //   const petSitter = await this.prisma.petSitterProfile.findUnique({
  //     where: { userId },
  //   });

  //   if (!petSitter) {
  //     throw new BadRequestException('Pet sitter profile not found');
  //   }

  //   if (petSitter.profileStatus !== 'ACTIVE') {
  //     throw new BadRequestException('Pet sitter profile is not active');
  //   }

  //   const image = await this.cloudinary.uploadFile(file);

  //   const service = await this.prisma.service.create({
  //     data: {
  //       petSitterId: petSitter.id,
  //       description: payload.description,
  //       durationInMinutes: payload.duration,
  //       name: payload.name,
  //       price: payload.price,
  //       thumbnailImage: image.secure_url,
  //       whatsIncluded: payload.whatsIncluded,
  //       tags: payload.tags || [],
  //     },
  //   });

  //   return ApiResponse.success('Service created successfully', service);
  // }

  async createService(
    userId: string,
    payload: CreateServiceDto,
    file?: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
    });

    if (!petSitter) {
      throw new BadRequestException('Pet sitter profile not found');
    }

    if (petSitter.profileStatus !== 'ACTIVE') {
      throw new BadRequestException('Pet sitter profile is not active');
    }

    const image = await this.cloudinary.uploadFile(file);

    // --- Atomic transaction for uniqueness ---
    return await this.prisma.$transaction(async (tx) => {
      let serviceId: string;
      const MAX_RETRIES = 5;
      let retries = 0;

      while (retries < MAX_RETRIES) {
        try {
          serviceId = generateUniqueId('S');

          const service = await tx.service.create({
            data: {
              petSitterId: petSitter.id,
              description: payload.description,
              durationInMinutes: payload.duration,
              name: payload.name,
              price: payload.price,
              thumbnailImage: image.secure_url,
              whatsIncluded: payload.whatsIncluded,
              tags: payload.tags || [],
              serviceId,
            },
          });

          return ApiResponse.success('Service created successfully', service);
        } catch (err: any) {
          // Prisma unique constraint error
          if (err.code === 'P2002') {
            retries++;
            continue; // try generating a new ID
          }
          throw err;
        }
      }

      throw new Error(
        'Failed to generate unique service ID after multiple attempts'
      );
    });
  }

  async getAllServicesByPetSitter(
    petSitterId: string,
    userId: string,
    cursor?: string,
    search?: string,
    limit = 20
  ) {
    limit = Math.min(limit, 50);

    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { id: petSitterId },
    });

    if (!petSitter) {
      throw new BadRequestException('Pet sitter profile not found');
    }

    const isOwner = petSitter.userId === userId;

    // Base where: only non-deleted services
    const where: Prisma.ServiceWhereInput = {
      petSitterId: petSitter.id,
      isDeleted: false,
    };

    // Only non-owner sees available services
    if (!isOwner) {
      where.isAvailable = true;
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }, // matches any exact tag
        // WhatsIncluded array search: exact match only
        { whatsIncluded: { has: search } },
      ];
    }

    const services = await this.prisma.service.findMany({
      where,
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        durationInMinutes: true,
        thumbnailImage: true,
        whatsIncluded: true,
        tags: true,
        serviceId: true,
        isAvailable: true, // always select actual DB value
        petSitterProfile: {
          select: {
            status: true,
            user: {
              select: {
                id: true,
                fullName: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Determine next cursor
    let nextCursor: string | null = null;
    if (services.length > limit) {
      const nextItem = services.pop();
      nextCursor = nextItem?.id ?? null;
    }

    return ApiResponse.success('Services fetched successfully', {
      data: services,
      nextCursor,
      hasNextPage: !!nextCursor,
    });
  }

  async getAllService(
    cursor?: string,
    limit = 20,
    search?: string,
    filters?: { minPrice?: number; maxPrice?: number }
  ) {
    limit = Math.min(limit, 50);

    const where: Prisma.ServiceWhereInput = {
      isDeleted: false,
      isAvailable: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
        { whatsIncluded: { has: search } },
      ];
    }

    // Price filter
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    const services = await this.prisma.service.findMany({
      where,
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        durationInMinutes: true,
        thumbnailImage: true,
        whatsIncluded: true,
        tags: true,
        isAvailable: true,
        petSitterProfile: {
          select: {
            status: true,
            user: {
              select: {
                id: true,
                fullName: true,
                image: true,
              },
            },
          },
        },
      },
    });

    let nextCursor: string | null = null;
    if (services.length > limit) {
      const nextItem = services.pop();
      nextCursor = nextItem?.id ?? null;
    }

    return ApiResponse.success('Services fetched successfully', {
      data: services,
      nextCursor,
      hasNextPage: !!nextCursor,
    });
  }

  async getServiceById(serviceId: string, userId: string) {
    // Fetch the service that is not deleted
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        isDeleted: false, // soft-deleted services are never returned
        OR: [
          { isAvailable: true }, // public services
          { petSitterProfile: { userId } }, // the owner can see their own available service
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        durationInMinutes: true,
        thumbnailImage: true,
        whatsIncluded: true,
        tags: true,
        isAvailable: true,
        petSitterProfile: {
          select: {
            userId: true,
            status: true,
            user: {
              select: {
                id: true,
                fullName: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!service) {
      throw new BadRequestException('Service not found');
    }

    const isOwner = service.petSitterProfile.userId === userId;

    return ApiResponse.success('Service fetched successfully', {
      ...service,
      isOwner,
    });
  }

  async getAllMyService(
    userId: string,
    cursor?: string,
    limit = 20,
    search?: string
  ) {
    limit = Math.min(limit, 50);

    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!petSitter) {
      throw new BadRequestException('Pet sitter profile not found');
    }

    const where: Prisma.ServiceWhereInput = {
      petSitterId: petSitter.id,
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }, // matches any exact tag
        // WhatsIncluded array search: exact match only
        { whatsIncluded: { has: search } },
      ];
    }

    const services = await this.prisma.service.findMany({
      where,
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        durationInMinutes: true,
        thumbnailImage: true,
        whatsIncluded: true,
        tags: true,
        createdAt: true,
        isAvailable: true,
      },
    });

    const hasNextPage = services.length > limit;
    const data = hasNextPage ? services.slice(0, limit) : services;
    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    return ApiResponse.success('Services fetched successfully', {
      data,
      pagination: {
        nextCursor,
        hasNextPage,
      },
    });
  }

  async toggleServiceAvailability(userId: string, serviceId: string) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        isDeleted: false,
        petSitterProfile: {
          userId,
        },
      },
      select: {
        isAvailable: true,
      },
    });

    if (!service) {
      throw new BadRequestException('Service not found or unauthorized');
    }

    const updatedService = await this.prisma.service.update({
      where: { id: serviceId },
      data: {
        isAvailable: !service.isAvailable,
      },
      select: {
        id: true,
        name: true,
        isAvailable: true,
      },
    });

    return ApiResponse.success(
      `Service marked as ${updatedService.isAvailable ? 'available' : 'unavailable'} successfully`,
      updatedService
    );
  }

  async deleteService(userId: string, serviceId: string) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        isDeleted: false,
        petSitterProfile: {
          userId,
        },
      },
    });

    if (!service) {
      throw new BadRequestException('Service not found or unauthorized');
    }

    await this.prisma.service.update({
      where: { id: service.id },
      data: { isDeleted: true },
    });

    return ApiResponse.success('Service deleted successfully');
  }

  async updateService(
    payload: UpdateServiceDto,
    userId: string,
    serviceId: string,
    file?: Express.Multer.File
  ) {
    // Ensure the service exists and belongs to the user
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        isDeleted: false,
        petSitterProfile: { userId },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found or unauthorized');
    }

    const updateData: Partial<Service> = {};

    // Update simple fields
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.description !== undefined)
      updateData.description = payload.description;
    if (payload.price !== undefined) {
      updateData.price = new Prisma.Decimal(payload.price);
    }
    if (payload.durationInMinutes !== undefined)
      updateData.durationInMinutes = payload.durationInMinutes;

    // Handle array updates: add only new elements
    if (payload.whatsIncluded !== undefined) {
      const newItems = Array.isArray(payload.whatsIncluded)
        ? payload.whatsIncluded
        : [payload.whatsIncluded];
      updateData.whatsIncluded = Array.from(
        new Set([...service.whatsIncluded, ...newItems])
      );
    }

    if (payload.tags !== undefined) {
      const newTags = Array.isArray(payload.tags)
        ? payload.tags
        : [payload.tags];
      updateData.tags = Array.from(new Set([...service.tags, ...newTags]));
    }

    // Handle thumbnail update if file is provided
    if (file) {
      const image = await this.cloudinary.uploadFile(file);
      updateData.thumbnailImage = image.secure_url;
    }

    const updatedService = await this.prisma.service.update({
      where: { id: serviceId },
      data: updateData,
      select: {
        id: true,
        name: true,
        thumbnailImage: true,
        isAvailable: true,
        whatsIncluded: true,
        tags: true,
      },
    });

    return ApiResponse.success('Service updated successfully', updatedService);
  }

  async getAllServiceTags(search?: string) {
    // Fetch all services that are not deleted and optionally match search
    const services = await this.prisma.service.findMany({
      where: {
        isDeleted: false,
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { tags: { has: search } }, // matches any tag exactly
              { whatsIncluded: { has: search } }, // exact match in array
            ]
          : undefined,
      },
      select: {
        tags: true,
      },
    });

    // Flatten and deduplicate tags
    const uniqueTags = Array.from(
      new Set(services.flatMap((s) => s.tags || []))
    );

    return ApiResponse.success('Service tags fetched successfully', uniqueTags);
  }
}
