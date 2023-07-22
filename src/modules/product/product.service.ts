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
    const productRepo = this.productRepository.create(product as Product);
    productRepo.vendor = user;
    productRepo.category = category;
    return await this.productRepository.insert(productRepo);
  }

  async getAllProducts() {
    const productResponse = await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.vendor', 'user')
      .select(['products', 'category.id', 'category.title', 'user.username'])
      .getMany();
    if (productResponse.length === 0) throw new HttpException('product/no-product-found', HttpStatus.NOT_FOUND);
    return productResponse;
  }

  async getManyProducts(ids: number[]) {
    const productResponse = await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.vendor', 'user')
      .select(['products', 'category.id', 'category.title', 'user.username'])
      .where('products.id IN (:...ids)', { ids })
      .getMany();
    if (productResponse.length === 0) throw new HttpException('product/no-product-found', HttpStatus.NOT_FOUND);
    return productResponse;
  }

  async getOneProduct(id: number) {
    const productResponse = await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.vendor', 'user')
      .select(['products', 'category.id', 'category.title', 'user.username'])
      .where('products.id = :id ', { id })
      .getOne();
    if (productResponse === null) throw new HttpException('product/product-not-found', HttpStatus.NOT_FOUND);
    return productResponse;
  }

  async updateProduct(id: number, updateProduct: UpdateProductDto) {
    const productResponse = await this.productRepository.findOne({ where: { id } });
    if (productResponse === null) throw new HttpException('product/product-not-found', HttpStatus.NOT_FOUND);
    return await this.productRepository.update(id, updateProduct);
  }

  async deleteProduct(id: number) {
    const productResponse = await this.productRepository.exist({ where: { id } });
    if (!productResponse) throw new HttpException('product/product-not-found', HttpStatus.NOT_FOUND);
    return await this.productRepository.delete(id);
  }
}
