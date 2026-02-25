import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';

@Injectable()
export class ChatService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFileOrImage(file?: Express.Multer.File) {
    if (!file) return null;

    try {
      const result = await this.cloudinaryService.uploadFile(file, {
        folder: 'chat',
      });

      return ApiResponse.success('File uploaded successfully', {
        url: result.secure_url,
        format: result.format,
      });
    } catch (error) {
      console.error('Failed to upload file to Cloudinary:', error);
      return null;
    }
  }
}
