import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'dbzqxpjbg',
      api_key: '752446418527497',
      api_secret: 'xxoPsdSQS8Nlz8PIg1wYe6YsUW0',
    });
  },
};
