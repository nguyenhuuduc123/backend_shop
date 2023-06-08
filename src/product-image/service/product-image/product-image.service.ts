import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductImageService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}
  async createImageProduct(file: Express.Multer.File, productId: number) {
    const imageUpload = await this.cloudinary.uploadImage(file);
    // tao product image;
    return await this.prisma.productImage.create({
      data: {
        Url: imageUpload.url,
        publicIdImage: imageUpload.public_id,
        productId: productId,
      },
    });
  }
  async deleteProductImage(productImageId: number) {
    try {
      const product = await this.prisma.productImage.delete({
        where: {
          id: productImageId,
        },
      });

      if (!product) throw new BadRequestException('profile not found');
      if (product.Url) {
        await this.cloudinary.deleteImage(product.publicIdImage);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getAllProduct() {
    return await this.prisma.product.findMany();
  }
}
