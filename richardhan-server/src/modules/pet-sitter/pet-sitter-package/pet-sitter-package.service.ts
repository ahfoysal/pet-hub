import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreatePetSitterPackageDto,
  PackageQueryDto,
  UpdatePetSitterPackageDto,
} from './dto/pet-sitter-package.dto';
import { ApiResponse } from 'src/common/response/api-response';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from 'src/common/utils/generateUniqueIds';

@Injectable()
export class PetSitterPackageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService
  ) {}

  private MAX_SERVICES_PER_PACKAGE = 3;

  // async createPackage(
  //   userId: string,
  //   payload: CreatePetSitterPackageDto,
  //   file?: Express.Multer.File
  // ) {
  //   if (!file) {
  //     throw new BadRequestException('File is required');
  //   }

  //   // 1️⃣ Fetch pet sitter
  //   const petSitter = await this.prisma.petSitterProfile.findUnique({
  //     where: { userId },
  //   });

  //   if (!petSitter) throw new NotFoundException('Pet sitter profile not found');

  //   if (petSitter.profileStatus !== 'ACTIVE')
  //     throw new BadRequestException('Pet sitter profile is not active');

  //   // 2️⃣ Validate service and addon limits
  //   if (payload.serviceIds.length > this.MAX_SERVICES_PER_PACKAGE)
  //     throw new BadRequestException('Services limit reached');

  //   // 3️⃣ Upload package image
  //   const image = await this.cloudinary.uploadFile(file);

  //   let packageId: string;

  //   // 4️⃣ Atomic transaction
  //   return await this.prisma.$transaction(async (tx) => {
  //     // --- Fetch services in bulk ---
  //     const services = await tx.service.findMany({
  //       where: { id: { in: payload.serviceIds }, petSitterId: petSitter.id },
  //     });
  //     if (services.length !== payload.serviceIds.length) {
  //       const foundIds = services.map((s) => s.id);
  //       const missingIds = payload.serviceIds.filter(
  //         (id) => !foundIds.includes(id)
  //       );
  //       throw new NotFoundException(
  //         `Services not found: ${missingIds.join(', ')}`
  //       );
  //     }

  //     // --- Calculate total price ---
  //     const calculatedPrice = services.reduce(
  //       (sum, s) => sum + Number(s.price),
  //       0
  //     );

  //     const offeredPrice = payload.offeredPrice ?? calculatedPrice;
  //     if (offeredPrice > calculatedPrice)
  //       throw new BadRequestException(
  //         'Offered price cannot exceed calculated price'
  //       );

  //     // --- Create the package with linked services and AddOns ---
  //     const pkg = await tx.package.create({
  //       data: {
  //         name: payload.name,
  //         description: payload.description,
  //         durationInMinutes: payload.durationInMinutes,
  //         image: image.secure_url,
  //         petSitterId: petSitter.id,
  //         calculatedPrice,
  //         offeredPrice,
  //         packageServices: {
  //           create: services.map((s) => ({ serviceId: s.id })),
  //         },
  //       },
  //       select: {
  //         id: true,
  //         name: true,
  //         description: true,
  //         image: true,
  //         durationInMinutes: true,
  //         calculatedPrice: true,
  //         offeredPrice: true,
  //         createdAt: true,
  //       },
  //     });

  //     return ApiResponse.success('Package created successfully!', pkg);
  //   });
  // }

  async createPackage(
    userId: string,
    payload: CreatePetSitterPackageDto,
    file?: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // 1️⃣ Fetch pet sitter
    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
    });

    if (!petSitter) throw new NotFoundException('Pet sitter profile not found');

    if (petSitter.profileStatus !== 'ACTIVE')
      throw new BadRequestException('Pet sitter profile is not active');

    // 2️⃣ Validate service and addon limits
    if (payload.serviceIds.length > this.MAX_SERVICES_PER_PACKAGE)
      throw new BadRequestException('Services limit reached');

    // 3️⃣ Upload package image
    const image = await this.cloudinary.uploadFile(file);

    // 4️⃣ Atomic transaction
    return await this.prisma.$transaction(async (tx) => {
      // --- Fetch services in bulk ---
      const services = await tx.service.findMany({
        where: { id: { in: payload.serviceIds }, petSitterId: petSitter.id },
      });
      if (services.length !== payload.serviceIds.length) {
        const foundIds = services.map((s) => s.id);
        const missingIds = payload.serviceIds.filter(
          (id) => !foundIds.includes(id)
        );
        throw new NotFoundException(
          `Services not found: ${missingIds.join(', ')}`
        );
      }

      // --- Calculate total price ---
      const calculatedPrice = services.reduce(
        (sum, s) => sum + Number(s.price),
        0
      );

      const offeredPrice = payload.offeredPrice ?? calculatedPrice;
      if (offeredPrice > calculatedPrice)
        throw new BadRequestException(
          'Offered price cannot exceed calculated price'
        );

      // --- Generate unique packageId ---
      let packageId: string;
      const MAX_RETRIES = 5;
      let retries = 0;

      while (retries < MAX_RETRIES) {
        try {
          packageId = generateUniqueId('P');

          const pkg = await tx.package.create({
            data: {
              packageId, // assign generated ID
              name: payload.name,
              description: payload.description,
              durationInMinutes: payload.durationInMinutes,
              image: image.secure_url,
              petSitterId: petSitter.id,
              calculatedPrice,
              offeredPrice,
              packageServices: {
                create: services.map((s) => ({ serviceId: s.id })),
              },
            },
            select: {
              id: true,
              name: true,
              description: true,
              image: true,
              durationInMinutes: true,
              calculatedPrice: true,
              offeredPrice: true,
              createdAt: true,
              packageId: true,
            },
          });

          return ApiResponse.success('Package created successfully!', pkg);
        } catch (err: any) {
          // Prisma unique constraint error code
          if (err.code === 'P2002') {
            retries++;
            continue; // try generating a new ID
          }
          throw err;
        }
      }

      throw new Error(
        'Failed to generate unique package ID after multiple attempts'
      );
    });
  }

  async getAllPackagesByPetSitter(
    petSitterId: string,
    cursor?: string,
    limit = 10,
    search?: string,
    filter?: {
      minPrice?: number;
      maxPrice?: number;
      durationMin?: number;
      durationMax?: number;
    }
  ) {
    limit = Math.min(limit, 50);

    // 1️⃣ Validate pet sitter
    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { id: petSitterId },
    });

    if (!petSitter) {
      throw new BadRequestException('Pet sitter profile not found');
    }

    if (petSitter.profileStatus !== 'ACTIVE') {
      throw new BadRequestException('Pet sitter profile is not active');
    }

    // 2️⃣ Build WHERE clause
    const where: Prisma.PackageWhereInput = {
      petSitterId: petSitter.id,
      isDeleted: false,
    };

    // 🔍 Search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 🎯 Filters
    if (filter?.minPrice || filter?.maxPrice) {
      where.offeredPrice = {
        gte: filter.minPrice,
        lte: filter.maxPrice,
      };
    }

    if (filter?.durationMin || filter?.durationMax) {
      where.durationInMinutes = {
        gte: filter.durationMin,
        lte: filter.durationMax,
      };
    }

    // 3️⃣ Fetch packages (cursor pagination)
    const packages = await this.prisma.package.findMany({
      where,
      take: limit + 1, // fetch extra for nextCursor
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        durationInMinutes: true,
        calculatedPrice: true,
        offeredPrice: true,
        createdAt: true,
        packageId: true,
      },
    });

    // 4️⃣ Cursor handling
    let nextCursor: string | null = null;

    if (packages.length > limit) {
      const nextItem = packages.pop();
      nextCursor = nextItem!.id;
    }

    return {
      data: packages,
      pagination: {
        nextCursor,
        limit,
      },
    };
  }

  async getMyPackages(userId: string, query: PackageQueryDto) {
    const {
      cursor,
      limit,
      search,
      minPrice,
      maxPrice,
      durationMin,
      durationMax,
    } = query;

    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
    });

    if (!petSitter)
      throw new BadRequestException('Pet sitter profile not found');

    if (petSitter.profileStatus !== 'ACTIVE')
      throw new BadRequestException('Pet sitter profile is not active');

    const where: Prisma.PackageWhereInput = {
      petSitterId: petSitter.id,
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.offeredPrice = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    if (durationMin || durationMax) {
      where.durationInMinutes = {
        gte: durationMin,
        lte: durationMax,
      };
    }

    const packages = await this.prisma.package.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        image: true,
        offeredPrice: true,
        calculatedPrice: true,
        durationInMinutes: true,
        createdAt: true,
        packageId: true,
      },
    });

    const hasNextPage = packages.length > limit;
    const data = hasNextPage ? packages.slice(0, -1) : packages;

    return ApiResponse.success('Packages fetched successfully', {
      data,
      nextCursor: hasNextPage ? data[data.length - 1].id : null,
    });
  }

  async getPackageDetails(packageId: string, userId?: string) {
    const pkg = await this.prisma.package.findUnique({
      where: { id: packageId },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        durationInMinutes: true,
        isDeleted: true,
        calculatedPrice: true,
        offeredPrice: true,
        petSitterId: true,
        packageId: true,
        packageServices: {
          select: {
            service: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!pkg || pkg.isDeleted) {
      throw new NotFoundException('Package not found');
    }

    // Optional: verify pet sitter profile is active
    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { id: pkg.petSitterId },
      select: { profileStatus: true, id: true },
    });

    if (!petSitter || petSitter.profileStatus !== 'ACTIVE') {
      throw new BadRequestException('Pet sitter profile is not active');
    }

    return ApiResponse.success('Package details fetched successfully', {
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      image: pkg.image,
      durationInMinutes: pkg.durationInMinutes,
      packageId: pkg.packageId,
      calculatedPrice: pkg.calculatedPrice,
      offeredPrice: pkg.offeredPrice,

      services: pkg.packageServices.map((ps) => ps.service),

      isOwner: Boolean(userId && petSitter && pkg.petSitterId === petSitter.id),
    });
  }

  async getAllPackages(search?: string, limit = 20, cursor?: string) {
    // Build search filter only if search term is provided
    const searchFilter: Prisma.PackageWhereInput = {
      isDeleted: false,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // Fetch packages with cursor-based pagination
    const packages = await this.prisma.package.findMany({
      where: searchFilter,
      take: limit + 1, // Fetch one extra to check for next page
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        image: true,
        offeredPrice: true,
        calculatedPrice: true,
        durationInMinutes: true,
        packageId: true,
        createdAt: true,
        petSitter: {
          select: {
            id: true,
            profileStatus: true,
            status: true,
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        packageServices: {
          select: {
            service: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    // Determine if there is a next page
    const hasNext = packages.length > limit;
    if (hasNext) packages.pop(); // remove the extra record

    // Next cursor for pagination
    const nextCursor = hasNext ? packages[packages.length - 1].id : null;

    // Return response using the same object format as other services
    return ApiResponse.success('Packages fetched successfully', {
      packages,
      nextCursor,
    });
  }

  async togglePackageStatus(packageId: string, userId: string) {
    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
    });

    if (!petSitter || petSitter.profileStatus !== 'ACTIVE') {
      throw new NotFoundException('Pet sitter profile not found, or inactive');
    }

    const pkg = await this.prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg || pkg.isDeleted) {
      throw new NotFoundException('Package not found');
    }

    if (pkg.petSitterId !== petSitter.id) {
      throw new ForbiddenException(
        'You are not allowed to update this package'
      );
    }

    const updatedPackage = await this.prisma.package.update({
      where: { id: packageId },
      data: { isAvailable: !pkg.isAvailable },
    });

    return ApiResponse.success(
      `Package marked as ${updatedPackage.isAvailable ? 'available' : 'unavailable'} successfully`
    );
  }

  async updatePackage(
    packageId: string,
    userId: string,
    dto: UpdatePetSitterPackageDto,
    file?: Express.Multer.File
  ) {
    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
    });

    if (!petSitter || petSitter.profileStatus !== 'ACTIVE') {
      throw new NotFoundException('Pet sitter profile not found or inactive');
    }

    const pkg = await this.prisma.package.findUnique({
      where: { id: packageId },
      include: {
        packageServices: {
          select: { serviceId: true },
        },
      },
    });

    if (!pkg || pkg.isDeleted) {
      throw new NotFoundException('Package not found');
    }

    let image = pkg.image;

    if (file) {
      const uploaded = await this.cloudinary.uploadFile(file, {
        folder: 'pet-sitter-package',
      });
      image = uploaded.secure_url;
    }

    return this.prisma.$transaction(async (tx) => {
      /* ===================== SERVICES (SYNC) ===================== */
      if (dto.serviceIds !== undefined) {
        if (dto.serviceIds.length > this.MAX_SERVICES_PER_PACKAGE) {
          throw new BadRequestException('Services limit reached');
        }

        // 1. Remove services not in the new list
        await tx.packageService.deleteMany({
          where: {
            packageId,
            serviceId: { notIn: dto.serviceIds },
          },
        });

        // 2. Add services from the new list that are not already present
        const existingServices = await tx.packageService.findMany({
          where: { packageId },
          select: { serviceId: true },
        });
        const existingIds = new Set(existingServices.map((es) => es.serviceId));
        const missingIds = dto.serviceIds.filter((id) => !existingIds.has(id));

        if (missingIds.length > 0) {
          // Fetch and validate new services
          const services = await tx.service.findMany({
            where: {
              id: { in: missingIds },
              petSitterId: petSitter.id,
              isDeleted: false,
            },
          });

          if (services.length !== missingIds.length) {
            throw new BadRequestException('Invalid or missing services');
          }

          await tx.packageService.createMany({
            data: services.map((s) => ({
              packageId,
              serviceId: s.id,
            })),
            skipDuplicates: true,
          });
        }
      }

      /* ===================== PRICE RECALCULATION ===================== */
      const packageWithServices = await tx.package.findUnique({
        where: { id: packageId },
        include: { packageServices: { include: { service: true } } },
      });

      if (!packageWithServices) {
        throw new NotFoundException('Package not found');
      }

      const calculatedPrice = packageWithServices.packageServices.reduce(
        (acc, ps) => acc + Number(ps.service.price || 0),
        0
      );

      const offeredPrice =
        dto.offeredPrice !== undefined ? dto.offeredPrice : pkg.offeredPrice;

      if (Number(offeredPrice) > calculatedPrice) {
        throw new BadRequestException(
          'Offered price cannot exceed calculated price'
        );
      }

      /* ===================== PACKAGE UPDATE ===================== */
      const updatedPackage = await tx.package.update({
        where: { id: packageId },
        data: {
          name: dto.name ?? pkg.name,
          description: dto.description ?? pkg.description,
          durationInMinutes: dto.durationInMinutes ?? pkg.durationInMinutes,
          image,
          calculatedPrice,
          offeredPrice,
        },
      });

      return ApiResponse.success(
        'Package updated successfully',
        updatedPackage
      );
    });
  }

  async deletePackage(userId: string, packageId: string) {
    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
    });

    if (!petSitter || petSitter.profileStatus !== 'ACTIVE') {
      throw new NotFoundException('Pet sitter not found');
    }

    const pkg = await this.prisma.package.findUnique({
      where: { id: packageId, petSitterId: petSitter.id },
    });

    if (!pkg || pkg.isDeleted) {
      throw new NotFoundException('Package not found');
    }

    await this.prisma.package.update({
      where: { id: packageId },
      data: { isDeleted: true },
    });

    return ApiResponse.success('Package deleted successfully');
  }
}
