import { IsArray, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Product } from 'src/modules/product/entity/product.entity';
import { User } from 'src/modules/user/entity/user.entity';

export class CreateCartItemDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsNotEmpty()
  @IsObject()
  session: User;

  @IsNumber()
  @IsNotEmpty()
  @IsArray()
  products: Product[];
}
