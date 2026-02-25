import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { RoomAvailabilityService } from '../room-availability/room-availability.service';
import { CreateHotelRoomDto } from './dto/create-room.dto';
import { UpdateHotelRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly roomAvailabilityService: RoomAvailabilityService
  ) {}

  async create(
    dto: CreateHotelRoomDto,
    profileId: string,
    files: Express.Multer.File[]
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one room image is required');
    }

    const hotelProfile = await this.prisma.hotelProfile.findUnique({
      where: { id: profileId },
    });
    if (!hotelProfile) throw new NotFoundException('Hotel profile not found');

    const uploadedImages =
      await this.cloudinaryService.uploadMultipleFiles(files);
    const imageUrls = uploadedImages.map((img) => img.secure_url);

    const roomData = {
      hotelProfileId: profileId,
      roomNumber: dto.roomNumber,
      images: imageUrls,
      description: dto.description,
      roomAmenities: dto.roomAmenities,
      petCapacity: dto.petCapacity,
      price: dto.price,
      humanCapacity: dto.humanCapacity,
      roomType: dto.roomType,
    };

    const room = await this.prisma.room.create({
      data: roomData,
    });

    await this.roomAvailabilityService.generateCalender(room.id);

    return ApiResponse.success('Room created successfully', room);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const numberedPage = Number(page);
    const numberedLimit = Number(limit);
    const skip = (numberedPage - 1) * numberedLimit;
    const [rooms, total] = await Promise.all([
      this.prisma.room.findMany({
        skip,
        take: numberedLimit,
        orderBy: { createdAt: 'desc' },
        include: {
          hotelProfile: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              rating: true,
              reviewCount: true,
              images: true,
            },
          },
        },
      }),

      this.prisma.room.count(),
    ]);
    return ApiResponse.success('Rooms fetched successfully', {
      rooms,
      meta: {
        total,
        page: numberedPage,
        limit: numberedLimit,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  async findAllByHotel(hotelProfileId: string) {
    const rooms = await this.prisma.room.findMany({
      where: { hotelProfileId },
      orderBy: { createdAt: 'desc' },
      include: {
        hotelProfile: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            rating: true,
            reviewCount: true,
            images: true,
          },
        },
      },
    });

    return ApiResponse.success('Rooms fetched successfully', rooms);
  }

  async getMyHotelRooms(profileId: string) {
    const rooms = await this.prisma.room.findMany({
      where: { hotelProfileId: profileId },
      orderBy: { createdAt: 'desc' },
    });
    return ApiResponse.success('Rooms fetched successfully', rooms);
  }

  async findOne(roomId: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId,
      },
      include: {
        hotelProfile: true,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return ApiResponse.success('Room found', room);
  }

  async update(
    roomId: string,
    hotelProfileId: string,
    dto: UpdateHotelRoomDto,
    files?: Express.Multer.File[]
  ) {
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId,
        hotelProfileId,
      },
    });
    if (!room) throw new NotFoundException('Room not found');

    const uploadedImages = files?.length
      ? await this.cloudinaryService.uploadMultipleFiles(files)
      : [];
    const newImageUrls = uploadedImages.map((img) => img.secure_url);
    const images = [...(dto.prevImages ?? room.images), ...newImageUrls];

    const updateRoomData = {
      roomNumber: dto.roomNumber ?? room.roomNumber,
      images,
      description: dto.description ?? room.description,
      roomAmenities: dto.roomAmenities ?? room.roomAmenities,
      petCapacity: dto.petCapacity ?? room.petCapacity,
      price: dto.price ?? room.price,
      humanCapacity: dto.humanCapacity ?? room.humanCapacity,
      roomType: dto.roomType ?? room.roomType,
      status: dto.status ?? room.status,
    };

    const result = await this.prisma.room.update({
      where: { id: roomId, hotelProfileId },
      data: updateRoomData,
    });

    return ApiResponse.success('Room updated successfully', result);
  }

  async remove(roomId: string, hotelProfileId: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId,
        hotelProfileId,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    await this.prisma.room.delete({
      where: { id: roomId },
    });

    return ApiResponse.success('Room deleted successfully');
  }
}
