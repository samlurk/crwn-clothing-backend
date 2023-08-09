import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CategoryService } from '../category/category.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService
  ) {}

  async addProduct(newProduct: CreateProductDto) {
    const { categoryId, userId, ...product } = newProduct;
    const category = await this.categoryService.getOneCategory(categoryId);
    const user = await this.userService.getOneUserById(userId);
    return await this.productRepository
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values({ ...product, vendor: user, category })
      .execute();
  }

  async getAllProducts() {
    const productResponse = await this.productRepository
      .createQueryBuilder('products')
      .innerJoinAndSelect('products.category', 'category')
      .innerJoinAndSelect('products.vendor', 'vendor')
      .select(['products', 'category.id', 'vendor.id'])
      .getMany();
    if (productResponse.length === 0) throw new HttpException('product/no-product-found', HttpStatus.NOT_FOUND);
    return productResponse;
  }

  async getManyProducts(ids: number[]) {
    const productResponse = await this.productRepository
      .createQueryBuilder('products')
      .innerJoinAndSelect('products.category', 'category')
      .innerJoinAndSelect('products.vendor', 'vendor')
      .select(['products', 'category.id', 'vendor.id'])
      .where('products.id IN (:...ids)', { ids })
      .getMany();
    if (productResponse.length === 0) throw new HttpException('product/no-product-found', HttpStatus.NOT_FOUND);
    return productResponse;
  }

  async getOneProduct(id: number) {
    const productResponse = await this.productRepository
      .createQueryBuilder('products')
      .innerJoinAndSelect('products.category', 'category')
      .innerJoinAndSelect('products.vendor', 'vendor')
      .select(['products', 'category.id', 'vendor.id'])
      .where('products.id = :id ', { id })
      .getOne();
    if (productResponse === null) throw new HttpException('product/product-not-found', HttpStatus.NOT_FOUND);
    return productResponse;
  }

  async updateProduct(id: number, updateProduct: UpdateProductDto) {
    await this.getOneProduct(id);
    return await this.productRepository
      .createQueryBuilder('products')
      .update(Product)
      .set(updateProduct)
      .where('id = :id', { id })
      .execute();
  }

  async deleteProduct(id: number) {
    const productResponse = await this.productRepository.exist({ where: { id } });
    if (!productResponse) throw new HttpException('product/product-not-found', HttpStatus.NOT_FOUND);
    return await this.productRepository
      .createQueryBuilder('products')
      .delete()
      .from(Product)
      .where('id = :id', { id })
      .execute();
  }

  async incrementProductInventory(productId: number, increase = 1) {
    await this.productRepository.increment({ id: productId }, 'inventory', increase);
  }

  async decrementProductInventory(productId: number, decrease = 1) {
    await this.productRepository.decrement({ id: productId }, 'inventory', decrease);
  }
}
