import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { PaymentDetailProvider } from 'src/modules/payment-detail/enums/payment-detail-provider.enum';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  paymentId: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([PaymentDetailProvider.Stripe])
  provider: PaymentDetailProvider;
}
