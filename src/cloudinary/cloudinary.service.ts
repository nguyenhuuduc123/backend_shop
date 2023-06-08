import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DeleteApiResponse,
  UploadApiErrorResponse,
  UploadApiResponse,
  v2,
} from 'cloudinary';
import toStream = require('buffer-to-stream');
@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }
  async uploadImages(
    files: Express.Multer.File[],
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }
  async deleteImage(publicId: string): Promise<DeleteApiResponse> {
    return await v2.uploader.destroy(publicId).catch((e) => {
      throw new BadRequestException(e);
    });
  }
  async deleteImages(files: any[]) {
    try {
      return await files.map((file) => this.deleteImage(file.public_id));
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
