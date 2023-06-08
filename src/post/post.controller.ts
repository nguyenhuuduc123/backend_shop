import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PostService } from './post.service';
import { Public } from 'src/common/decorators';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.postService.uploadImageToCloudinary(file);
  }
  @Public()
  @Get('sendmail')
  async sendMail() {
    await this.postService.sendMail();
  }
}
