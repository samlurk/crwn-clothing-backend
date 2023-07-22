import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Product } from 'src/modules/product/entity/product.entity';

export class UpdateCartItemDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  total: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  session: number;

  @IsNotEmpty()
  @IsOptional()
  @IsArray()
  products: Product[];
}
