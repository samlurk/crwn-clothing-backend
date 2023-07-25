import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCartItemDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateCartItemsDto {
  cartItems: CreateCartItemDto[];
}
