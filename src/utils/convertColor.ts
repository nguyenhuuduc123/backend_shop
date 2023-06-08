import { COLOR } from '@prisma/client';

export class ConvertColor {
  static convertColor(color: string): COLOR {
    switch (color) {
      case 'RED': {
        return COLOR.RED;
      }
      case 'BLUE': {
        return COLOR.BLUE;
      }
      case 'GREEN': {
        return COLOR.GREEN;
      }
      case 'WHITE': {
        return COLOR.WHITE;
      }
      case 'YELLOW': {
        return COLOR.YELLOW;
      }
      case 'BLACK': {
        return COLOR.BLACK;
      }
      default: {
        break;
      }
    }
  }
}
