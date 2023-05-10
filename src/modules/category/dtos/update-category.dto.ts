import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  imageUrl: string;
}
