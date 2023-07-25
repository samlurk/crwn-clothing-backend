import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dtos/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/enums/user-role.enum';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('product')
  @HttpCode(200)
  async getAllProducts() {
    try {
      const productResponse = await this.productService.getAllProducts();
      return productResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('product/:id')
  @HttpCode(200)
  async getOneProduct(@Param('id', new ParseIntPipe()) id: number) {
    try {
      const productResponse = await this.productService.getOneProduct(id);
      return productResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('admin/product')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @HttpCode(201)
  async createProduct(@Body() newProduct: CreateProductDto) {
    try {
      return await this.productService.addProduct(newProduct);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('admin/product/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @HttpCode(204)
  async updateProduct(@Param('id', new ParseIntPipe()) id: number, @Body() updateCategory: UpdateProductDto) {
    try {
      return await this.productService.updateProduct(id, updateCategory);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('admin/product/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @HttpCode(204)
  async deleteProduct(@Param('id', new ParseIntPipe()) id: number) {
    try {
      return await this.productService.deleteProduct(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
