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
        url: imageUpload.url,
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
      if (product.url) {
        await this.cloudinary.deleteImage(product.publicIdImage);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getAllProduct() {
    return await this.prisma.product.findMany();
  }
  async createMany(productId: number, files?: Express.Multer.File[]) {
    try {
      if (files) {
        const images = await this.cloudinary.uploadImages(files).catch((e) => {
          throw new BadRequestException(e.message);
        });
        if (images) {
          images.forEach(async (img) => {
            await this.prisma.productImage.create({
              data: {
                url: img.url,
                publicIdImage: img.public_id,
                productId: productId,
              },
            });
          });
        }
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async deleteManyProductImage(productId: number) {
    try {
      //
      await this.prisma.productImage.deleteMany({
        where: {
          productId: productId,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
