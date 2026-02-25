import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(
    createFoodDto: CreateFoodDto,
    hotelId: string,
    files: Express.Multer.File[]
  ) {
    const uploadedFiles =
      await this.cloudinaryService.uploadMultipleFiles(files);
    const imageUrls = uploadedFiles.map((img) => img.secure_url);

    const foodData = {
      hotelProfileId: hotelId,
      name: createFoodDto.name,
      price: createFoodDto.price,
      description: createFoodDto.description,
      ingredients: createFoodDto.ingredients,
      images: imageUrls,
      calories: createFoodDto.calories,
      fat: createFoodDto.fat,
      foodFor: createFoodDto.foodFor,
      foodType: createFoodDto.foodType,
      gramPerServing: createFoodDto.gramPerServing,
      numberOfServing: createFoodDto.numberOfServing,
      petBreed: createFoodDto.petBreed,
      petCategory: createFoodDto.petCategory,
      protein: createFoodDto.protein,
      maxAge: createFoodDto.maxAge,
      minAge: createFoodDto.minAge,
      isAvailable: createFoodDto.isAvailable ?? true,
    };

    const food = await this.prisma.food.create({
      data: foodData,
    });
    return ApiResponse.success('Food created successfully', food);
  }

  async updateFood(
    foodId: string,
    hotelId: string,
    dto: UpdateFoodDto,
    files?: Express.Multer.File[]
  ) {
    const food = await this.prisma.food.findUnique({
      where: { id: foodId, hotelProfileId: hotelId },
    });
    if (!food) throw new NotFoundException('Food not found');

    const uploadedImages = files?.length
      ? await this.cloudinaryService.uploadMultipleFiles(files)
      : [];
    const newImageUrls = uploadedImages.map((img) => img.secure_url);
    const images = [...(dto.prevImages ?? food.images), ...newImageUrls];

    const updateFoodData = {
      name: dto.name ?? food.name,
      price: dto.price ?? food.price,
      description: dto.description ?? food.description,
      calories: dto.calories ?? food.calories,
      fat: dto.fat ?? food.fat,
      foodFor: dto.foodFor ?? food.foodFor,
      foodType: dto.foodType ?? food.foodType,
      gramPerServing: dto.gramPerServing ?? food.gramPerServing,
      numberOfServing: dto.numberOfServing ?? food.numberOfServing,
      petBreed: dto.petBreed ?? food.petBreed,
      petCategory: dto.petCategory ?? food.petCategory,
      protein: dto.protein ?? food.protein,
      images,
    };

    const updatedFood = await this.prisma.food.update({
      where: { id: foodId, hotelProfileId: hotelId },
      data: updateFoodData,
    });
    return ApiResponse.success('Food updated successfully', updatedFood);
  }

  async getMyFoods(hotelId: string) {
    const foods = await this.prisma.food.findMany({
      where: {
        hotelProfileId: hotelId,
      },
    });

    return ApiResponse.success('Foods found successfully', foods);
  }

  async getSingleFood(foodId: string) {
    const food = await this.prisma.food.findUnique({
      where: { id: foodId },
      include: {
        hotelProfile: true,
      },
    });
    if (!food) throw new NotFoundException('Food not found');
    return ApiResponse.success('Food found successfully', food);
  }

  async getAllFoods(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [foods, total] = await this.prisma.$transaction([
      this.prisma.food.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          hotelProfile: true,
        },
      }),
      this.prisma.food.count(),
    ]);

    const hasNext = page * limit < total;
    const hasPrev = page > 1;

    return ApiResponse.success('Foods found successfully', {
      foods,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNext,
      hasPrev,
    });
  }

  async removeFood(foodId: string, hotelId: string) {
    const food = await this.prisma.food.findUnique({
      where: { id: foodId, hotelProfileId: hotelId },
    });
    if (!food) throw new NotFoundException('Food not found');
    await this.prisma.food.delete({
      where: { id: foodId },
    });
    return ApiResponse.success('Food deleted successfully', {
      foodId: food.id,
      foodName: food.name,
    });
  }
}
