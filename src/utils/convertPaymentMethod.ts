import { PAYMENTMETHOD } from '@prisma/client';

export class ConvertPaymentMethod {
  static ConvertPaymentMethod(paymentMethod: string): PAYMENTMETHOD {
    switch (paymentMethod) {
      case 'DIRECT': {
        return PAYMENTMETHOD.DIRECT;
      }
      case 'INDIRECT': {
        return PAYMENTMETHOD.INDIRECT;
      }
      default: {
        break;
      }
    }
  }
}
