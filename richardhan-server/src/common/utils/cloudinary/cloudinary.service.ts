import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CloudinaryConfig } from 'src/config/cloudinary.config';

cloudinary.config(CloudinaryConfig);

export type CloudinaryResourceType = 'image' | 'video' | 'auto';

@Injectable()
export class CloudinaryService {
  private getPublicIdFromUrl(url: string): string {
    // Example URL:
    // https://res.cloudinary.com/<cloud_name>/image/upload/v123456789/folder/filename.jpg
    const urlParts = url.split('/');
    const versionIndex = urlParts.findIndex((part) => part.startsWith('v'));
    if (versionIndex === -1) return '';

    // public_id = everything after version, remove file extension
    const pathParts = urlParts.slice(versionIndex + 1);
    const fileNameWithExt = pathParts.join('/'); // folder/filename.jpg
    const publicId = fileNameWithExt.replace(/\.[^/.]+$/, ''); // remove extension
    return publicId;
  }

  async uploadFile(
    file: Express.Multer.File,
    options?: {
      folder?: string;
      resourceType?: CloudinaryResourceType;
    }
  ): Promise<UploadApiResponse> {
    if (!file) {
      throw new InternalServerErrorException('No file provided for upload');
    }

    // If we have a file path (DiskStorage)
    if (file.path) {
      const filePath = path.resolve(file.path);
      try {
        await fs.access(filePath);
        const result = await cloudinary.uploader.upload(filePath, {
          resource_type: options?.resourceType ?? 'auto',
          folder: options?.folder,
        });
        return result;
      } catch (error: any) {
        console.error(error);
        const message = error?.error?.message || error?.message || 'Cloudinary upload failed';
        throw new InternalServerErrorException(message);
      } finally {
        await this.safeUnlink(filePath);
      }
    }

    // If we have a buffer (MemoryStorage)
    if (file.buffer) {
      return new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: options?.folder,
            resource_type: options?.resourceType ?? 'auto',
          },
          (error, result) => {
            if (error) return reject(new BadGatewayException(error.message));
            if (!result) return reject(new BadGatewayException('Cloudinary upload failed: No result'));
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });
    }

    throw new InternalServerErrorException('File has neither path nor buffer');
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    options?: {
      folder?: string;
      resourceType?: CloudinaryResourceType;
    }
  ): Promise<UploadApiResponse[]> {
    if (!files?.length) {
      throw new InternalServerErrorException('No files provided for upload');
    }

    return Promise.all<UploadApiResponse>(
      files.map((file) => this.uploadFile(file, options))
    );
  }

  async uploadImageFromBuffer(
    file: Express.Multer.File,
    folder: string = 'images'
  ): Promise<UploadApiResponse> {
    if (!file.buffer) {
      throw new BadRequestException(
        `Image file "${file.originalname}" has no buffer`
      );
    }

    return new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error) return reject(new BadGatewayException(error.message));
          resolve(result!);
        }
      );
      stream.end(file.buffer);
    });
  }

  async uploadPostsMedia(files: Express.Multer.File[]) {
    if (!files?.length) {
      throw new BadRequestException('No files provided for upload');
    }

    const uploadedResults: UploadApiResponse[] = [];
    const folder = 'posts';
    const videoType = 'Posts';

    try {
      for (const file of files) {
        if (file.mimetype.startsWith('video/')) {
          // Upload video from buffer
          const uploadedVideo = await this.uploadVideo(file, folder, videoType);
          uploadedResults.push(uploadedVideo);
        } else if (file.mimetype.startsWith('image/')) {
          const uploadedImage = await this.uploadImageFromBuffer(file, folder);
          uploadedResults.push(uploadedImage);
        } else {
          throw new BadRequestException(
            `Unsupported file type: ${file.mimetype}`
          );
        }
      }

      return uploadedResults;
    } catch (err) {
      // Cleanup already uploaded files
      await Promise.all(
        uploadedResults.map((f) => this.deleteFile(f.secure_url))
      );
      throw err;
    }
  }

  /**
   * Upload a video to Cloudinary from memory buffer
   * @param file - Multer file object (memory storage recommended)
   * @param folder - optional folder in Cloudinary (default: "reels")
   * @returns Cloudinary UploadApiResponse
   */
  async uploadVideo(
    file: Express.Multer.File,
    folder?: string,
    videoType: 'Reels' | 'Stories' | 'Posts' = 'Stories'
  ): Promise<UploadApiResponse> {
    if (!file || !file.buffer) {
      throw new BadRequestException('No video file provided for upload');
    }
    if (!file.mimetype.startsWith('video/')) {
      throw new BadRequestException('Only video files are allowed');
    }

    const VIDEO_LIMITS = {
      Stories: { sizeMB: 50, durationSec: 60 }, // short, fast-loading
      Reels: { sizeMB: 120, durationSec: 120 }, // short-form high-quality
      Posts: { sizeMB: 400, durationSec: 300 }, // high-quality feed posts
    };

    const { sizeMB, durationSec } = VIDEO_LIMITS[videoType];
    folder = folder || videoType.toLowerCase();

    if (file.size > sizeMB * 1024 * 1024) {
      throw new BadRequestException(
        `Video "${file.originalname}" exceeds ${sizeMB}MB size limit`
      );
    }

    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'video', chunk_size: 6_000_000 },
          (error, result) => {
            if (error) return reject(new BadGatewayException(error.message));
            if (!result)
              return reject(
                new BadGatewayException('Cloudinary returned no result')
              );
            resolve(result);
          }
        );
        stream.end(file.buffer);
      }
    );

    if (uploadResult.duration && uploadResult.duration > durationSec) {
      await cloudinary.uploader.destroy(uploadResult.public_id, {
        resource_type: 'video',
      });
      throw new BadRequestException(
        `Video "${file.originalname}" exceeds maximum duration of ${durationSec} seconds`
      );
    }

    return uploadResult;
  }

  async deleteFile(secure_url: string) {
    if (!secure_url) return;

    const publicId = this.getPublicIdFromUrl(secure_url);
    if (!publicId) return;

    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
    } catch (error) {
      console.error('Cloudinary deletion failed', error);
    }
  }

  async deleteMultipleFiles(secure_urls: string[]) {
    if (!secure_urls?.length) return;

    const images: string[] = [];
    const videos: string[] = [];

    for (const url of secure_urls) {
      const publicId = this.getPublicIdFromUrl(url);
      if (!publicId) continue;

      if (url.match(/\.(mp4|mov|avi|webm)$/i)) {
        videos.push(publicId);
      } else {
        images.push(publicId);
      }
    }

    try {
      if (images.length) {
        await cloudinary.api.delete_resources(images, {
          resource_type: 'image',
        });
      }
      if (videos.length) {
        await cloudinary.api.delete_resources(videos, {
          resource_type: 'video',
        });
      }
    } catch (error) {
      console.error('Cloudinary bulk deletion failed', error);
    }
  }

  // Safe file deletion
  private async safeUnlink(filePath: string) {
    try {
      await fs.unlink(filePath);
    } catch {
      // silently ignore
    }
  }
}
