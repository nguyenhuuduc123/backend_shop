import { MailerService } from '@nest-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PostService {
  constructor(
    private cloudinary: CloudinaryService,
    private mailService: MailerService,
  ) {}
  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }
  async sendMail() {
    this.mailService.sendMail({
      to: 'duccccccnguyen@gmail.com',
      from: 'duccccnguyen@gmail.com',
      subject: 'send mail',
      text: 'welocom',
      html: '<b> welcome send mail nestjs</b>',
    });
  }
}
