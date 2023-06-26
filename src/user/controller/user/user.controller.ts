import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';

import { GetCurrentUserIdByAT } from 'src/common/decorators/get-userId-at.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { EditUserDto } from 'src/user/dto/edit.user.dto';
import { QueryUserDto } from 'src/user/dto/query.user.dto';
import { UserService } from 'src/user/service/user/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('/all')
  async getAllUser(@Query() query: QueryUserDto) {
    console.log(query.email);
    console.log(query.userName);
    return await this.userService.filterUser(query);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('getbyid/:id')
  async getUserById(@Param('id') id: string) {
    const data = await this.userService.getUserById(Number(id));
    return {
      data,
    };
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @GetCurrentUserIdByAT('sub') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.userService.uploadAvatarUser(Number(id), file);
    return {
      data,
    };
  }

  @Delete('delete-avatar')
  async deleteProfile(@GetCurrentUserIdByAT('sub') id: string) {
    const data = await this.userService.deleteAvatar(Number(id));
    return {
      data,
      message: 'delete finished',
    };
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('blockUser')
  async blockUser(@Body('userId') id: string) {
    const data = this.userService.blockUserById(Number(id));
    return {
      data,
    };
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('unblockUser')
  async unBlockUser(@Body('userId') id: string) {
    const data = await this.userService.unBlockUserById(Number(id));
    return {
      data,
    };
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Get('individual')
  async getInformationIndividual(@GetCurrentUserIdByAT('sub') id: string) {
    const data = await this.userService.getUserById(Number(id));
    return {
      data,
    };
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Put('editInformation/:id')
  async updateInformation(
    @Param('id') id: string,
    @Body() editUserDto: EditUserDto,
  ) {
    const data = await this.userService.editInformation(
      Number(id),
      editUserDto,
    );
    return {
      data,
    };
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete('deleteUser/:id')
  async deleteUserById(@Param('id') id: string) {
    return await this.userService.getUserById(Number(id));
  }
}
