import { IsNotEmpty, IsNumber } from 'class-validator';

export class CartItemDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CartItemsDto {
  cartItems: CartItemDto[];
}
