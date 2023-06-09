import { Role } from '@prisma/client';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}
  // get alluser
  async getAllUser() {
    return await this.prisma.user.findMany({
      where: {
        isBlocked: false,
      },
      include: {
        Order: true,
      },
    });
  }
  async getUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        Order: true,
      },
    });
  }
  // chan user
  async blockUserById(id: number) {
    // tim nguoi dung
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (user != null && user.role != Role.ADMIN && user.isBlocked != true) {
      const blockedUser = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          isBlocked: true,
        },
      });
      if (blockedUser)
        throw new HttpException('chan user thanh cong', HttpStatus.OK);
    }
    throw new HttpException('user khong the chan ', HttpStatus.FORBIDDEN);
  }
  // bo chan user
  async unBlockUserById(id: number) {
    // tim nguoi dung
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (user != null && user.role != Role.ADMIN && user.isBlocked != false) {
      const blockedUser = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          isBlocked: false,
        },
      });
      if (blockedUser)
        throw new HttpException('bo chan user thanh cong', HttpStatus.OK);
    }
    throw new HttpException('user khong ton tai ', HttpStatus.BAD_REQUEST);
  }

  // upload avatar;
  async uploadAvatarUser(userId: number, file: Express.Multer.File) {
    // find user;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    // check user exist
    if (!user) throw new HttpException('user no found', HttpStatus.BAD_REQUEST);
    // upload images
    const upload = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
    // update user
    const userUpdate = this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar: upload.url,
        publicIdImage: upload.public_id,
      },
    });
    return userUpdate;
  }
  // delete avatar
  async deleteAvatar(userId: number) {
    try {
      const profile = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!profile) throw new BadRequestException('profile not found');
      if (profile.avatar) {
        await this.cloudinary.deleteImage(profile.publicIdImage);
      }
      // update lai profile
      const updateProfile = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          avatar: '',
          publicIdImage: '',
        },
      });
      return updateProfile;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  // get all user role admin
  async getAllUserRoleAdmin() {
    return await this.prisma.user.findMany({
      where: {
        role: Role.ADMIN,
      },
      orderBy: {
        firstName: 'asc',
      },
    });
  }
}