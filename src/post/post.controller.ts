import { Controller, Get, UseGuards } from '@nestjs/common';
// import { Public } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';

@Controller('post')
export class PostController {
  @UseGuards(AtGuard)
  @Get('')
  async getAll() {
    return '123';
  }
}
