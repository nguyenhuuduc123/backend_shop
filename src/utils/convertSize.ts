// enum SIZE {
//     XS
//     S
//     M
//     L
//     XL
//     XXL
//   }

import { SIZE } from '@prisma/client';

export class ConvertSize {
  static convertSize(size: string): SIZE {
    switch (size) {
      case 'XS': {
        return SIZE.XS;
      }
      case 'S': {
        return SIZE.S;
      }
      case 'M': {
        return SIZE.M;
      }
      case 'L': {
        return SIZE.L;
      }
      case 'XL': {
        return SIZE.XL;
      }
      case 'XXL': {
        return SIZE.XXL;
      }
      default: {
        break;
      }
    }
  }
}
