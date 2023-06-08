import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductImageService } from 'src/product-image/service/product-image/product-image.service';

@Controller('product-image')
export class ProductImageController {
  constructor(private productImageService: ProductImageService) {}
  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body('productId') productId: string,
  ) {
    return await this.productImageService.createImageProduct(
      file,
      Number(productId),
    );
  }
}
