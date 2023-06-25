import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
    const data = await this.productImageService.createImageProduct(
      file,
      Number(productId),
    );
    return { data };
  }
  @Delete(':productId')
  async deleteProfile(@Param('productId') id: string) {
    const data = await this.productImageService.deleteProductImage(Number(id));
    return { data };
  }

  @Post('createMany')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadManyImageProduct(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('productId') productId: string,
  ) {
    console.log('1');
    console.log(files);
    const data = await this.productImageService.createMany(
      Number(productId),
      files,
    );
    return { data };
  }

  @Delete('deletemany/:productId')
  async deleteAllImage(@Param('productId') id: string) {
    const data = await this.productImageService.deleteManyProductImage(
      Number(id),
    );
    return { data };
  }
}
