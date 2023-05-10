import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string | undefined;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  price: number;

  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  imageUrl: string;
}
