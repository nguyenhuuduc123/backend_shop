import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { Public } from 'src/common/decorators';
import { GetCurrentUserIdByAT } from 'src/common/decorators/get-userid-at.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserService } from 'src/user/service/user/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('/all')
  async getAllUser() {
    return await this.userService.getAllUser();
  }

  @Public()
  @Get('getbyid/:id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(Number(id));
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @GetCurrentUserIdByAT('sub') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatarUser(Number(id), file);
  }

  @Delete('delete-avatar')
  async deleteProfile(@GetCurrentUserIdByAT('sub') id: string) {
    return this.userService.deleteAvatar(Number(id));
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('blockUser')
  async blockUser(@Body('userId') id: string) {
    return this.userService.blockUserById(Number(id));
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('unblockUser')
  async unBlockUser(@Body('userId') id: string) {
    return this.userService.unBlockUserById(Number(id));
  }
}
