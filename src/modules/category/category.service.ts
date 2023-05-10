import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './entity/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}
  async addCategory(newCategory: CreateCategoryDto) {
    const category = this.categoryRepository.create({ ...newCategory });
    console.log(category);
    await this.categoryRepository.insert(category);
  }

  async getAllCategories() {
    const categoryResponse = await this.categoryRepository.find();
    if (categoryResponse.length === 0 || typeof categoryResponse[0] === undefined)
      throw new HttpException('category/no-category-found', HttpStatus.NOT_FOUND);
    return categoryResponse;
  }

  async getAllProductsByCategories() {
    const categoryResponse = await this.categoryRepository
      .createQueryBuilder('product_categories')
      .leftJoinAndSelect('product_categories.products', 'products')
      .leftJoinAndSelect('products.vendor', 'user')
      .select(['product_categories', 'products', 'user.username'])
      .getMany();
    if (categoryResponse.length === 0 || typeof categoryResponse[0] === undefined)
      throw new HttpException('category/no-category-found', HttpStatus.NOT_FOUND);
    return categoryResponse;
  }

  async getOneCategory(id: number) {
    const categoryResponse = await this.categoryRepository.findOne({ where: { id } });
    if (categoryResponse === null) throw new HttpException('category/no-category-found', HttpStatus.NOT_FOUND);
    return categoryResponse;
  }

  async updateCategory(id: number, updateCategory: UpdateCategoryDto) {
    const categoryResponse = await this.categoryRepository.findOne({ where: { id } });
    if (categoryResponse === null) throw new HttpException('category/no-category-found', HttpStatus.NOT_FOUND);
    await this.categoryRepository.update(id, updateCategory);
  }

  async deleteCategory(id: number) {
    const categoryResponse = await this.categoryRepository.exist({ where: { id } });
    if (!categoryResponse) throw new HttpException('category/no-category-found', HttpStatus.NOT_FOUND);
    await this.categoryRepository.delete(id);
  }
}
