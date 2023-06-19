import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { PrismaModule } from './prisma/prisma.module';
import { PostModule } from './post/post.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { EvaluateModule } from './evaluate/evaluate.module';
import { ProductImageModule } from './product-image/product-image.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoryProductModule } from './category-product/category-product.module';
import { MailerModule } from '@nest-modules/mailer';
import { OrderProductModule } from './order-product/order-product.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
            user: 'duccccnguyen@gmail.com',
            pass: 'woqwmywolonufkjs',
          },
        },
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: ['.development.env'],
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    PostModule,
    ProductModule,
    UserModule,
    OrderModule,
    EvaluateModule,
    ProductImageModule,
    CloudinaryModule,
    CategoryProductModule,
    OrderProductModule,
    StripeModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
