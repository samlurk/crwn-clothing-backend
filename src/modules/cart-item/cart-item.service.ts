import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { CartItem } from './entity/cart-item.entity';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';
import { CreateCartItemDto } from './dtos/create-cart-items.dto';
import { AssociativeCartItemInterface } from './interfaces/cart-item.interface';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>,
    private readonly userService: UserService,
    private readonly productService: ProductService
  ) {}

  async getAllCartItems(userId: number) {
    const cartItemResponse = await this.cartItemRepository
      .createQueryBuilder('cart_items')
      .innerJoinAndSelect('cart_items.session', 'user')
      .innerJoinAndSelect('cart_items.product', 'product')
      .select(['cart_items', 'product', 'user.id'])
      .where('cart_items.session = :userId', { userId })
      .getMany();
    if (cartItemResponse.length === 0) throw new HttpException('cart-item/no-cart-item-found', HttpStatus.NOT_FOUND);
    return cartItemResponse;
  }

  async getOneCartItem(userId: number, productId: number) {
    const cartItemResponse = await this.cartItemRepository
      .createQueryBuilder('cart_items')
      .innerJoinAndSelect('cart_items.session', 'user')
      .innerJoinAndSelect('cart_items.product', 'product')
      .select(['cart_items', 'product', 'user.id'])
      .where('cart_items.session = :userId AND cart_items.product = :productId', { userId, productId })
      .getOne();
    if (cartItemResponse === null) throw new HttpException('cart-item/cart-item-not-found', HttpStatus.NOT_FOUND);
    return cartItemResponse;
  }

  async addManyItemsToCart(userId: number, items: CreateCartItemDto[]) {
    const associativeCartItems = items.reduce(
      (prev, curr) => ({ ...prev, [curr.id]: curr }),
      {}
    ) as AssociativeCartItemInterface;

    const productIds = items.map((product) => product.id);
    const productResponse = await this.productService.getManyProducts(productIds);
    const userResponse = await this.userService.getOneUserById(userId);
    let updateResult: UpdateResult | undefined;
    let insertResult: InsertResult | undefined;

    const cartItemResponse = await this.cartItemRepository
      .createQueryBuilder('cart_items')
      .innerJoinAndSelect('cart_items.session', 'session')
      .innerJoinAndSelect('cart_items.product', 'product')
      .select(['cart_items', 'session.id', 'product.id'])
      .where('session.id = :userId AND product.id IN (:...productIds)', {
        userId,
        productIds
      })
      .getMany();

    for (let i = 0; i < productResponse.length; i++) {
      const productToAdd = productResponse[i];
      for (let k = 0; k < cartItemResponse.length; k++) {
        const cartItemOld = cartItemResponse[k];
        // if the cartItem exists, update the cartItem's data
        if (cartItemOld.product.id === productToAdd.id) {
          // if the quantity of the cart item is greater than the inventory to the product it gives error
          if (cartItemOld.quantity + associativeCartItems[productToAdd.id].quantity > cartItemOld.product.inventory) {
            throw new HttpException(
              { message: 'cart-item/product-out-of-stock', data: productToAdd },
              HttpStatus.NOT_FOUND
            );
          }
          updateResult = {
            ...updateResult,
            ...(await this.cartItemRepository
              .createQueryBuilder('cart_items')
              .update(CartItem)
              .set({
                quantity: cartItemOld.quantity + associativeCartItems[productToAdd.id].quantity,
                total: cartItemOld.total + productToAdd.price * associativeCartItems[productToAdd.id].quantity
              })
              .where('session = :userId AND product = :productId', {
                userId,
                productId: productToAdd.id
              })
              .execute()),
            affected: updateResult?.affected === undefined ? 1 : updateResult.affected + 1
          };
        }
      }
    }
    // if the cartItem doesn't exist, insert the cartItem's data
    let itemsToInsert: CartItem[] | undefined;
    productResponse.forEach((productToAdd) => {
      if (cartItemResponse.find((cartItemOld) => cartItemOld.product.id === productToAdd.id) === undefined) {
        const item = this.cartItemRepository.create({
          product: productToAdd,
          session: userResponse,
          quantity: associativeCartItems[productToAdd.id].quantity,
          total: productToAdd.price * associativeCartItems[productToAdd.id].quantity
        });
        itemsToInsert = itemsToInsert !== undefined ? [...itemsToInsert, item] : [item];
      }
    });
    if (itemsToInsert !== undefined)
      insertResult = {
        ...insertResult,
        ...(await this.cartItemRepository.createQueryBuilder().insert().into(CartItem).values(itemsToInsert).execute())
      };
    return {
      insertResult: insertResult !== undefined ? insertResult : null,
      updateResult: updateResult !== undefined ? updateResult : null
    };
  }

  async addItemToCart(userId: number, productId: number) {
    const productResponse = await this.productService.getOneProduct(productId);
    const userResponse = await this.userService.getOneUserById(userId);

    if (productResponse.inventory === 0)
      throw new HttpException('cart-item/product-out-of-stock', HttpStatus.FORBIDDEN);

    const cartItemResponse = await this.cartItemRepository
      .createQueryBuilder('cart_items')
      .innerJoinAndSelect('cart_items.session', 'session')
      .innerJoinAndSelect('cart_items.product', 'product')
      .where('cart_items.session = :userId AND cart_items.product = :productId', {
        userId,
        productId: productResponse.id
      })
      .getOne();

    if (cartItemResponse === null) {
      return await this.cartItemRepository
        .createQueryBuilder()
        .insert()
        .into(CartItem)
        .values({
          product: productResponse,
          session: userResponse,
          quantity: 1,
          total: productResponse.price
        })
        .execute();
    } else {
      const { id, quantity, total } = cartItemResponse;
      return await this.cartItemRepository
        .createQueryBuilder()
        .update(CartItem)
        .set({ quantity: quantity + 1, total: total + total / quantity })
        .where('cart_items.id = :id', { id })
        .execute();
    }
  }

  async removeItemToCart(userId: number, productId: number) {
    const { id, quantity, total } = await this.getOneCartItem(userId, productId);

    if (quantity === 1) {
      return await this.cartItemRepository
        .createQueryBuilder('cart_items')
        .delete()
        .from(CartItem)
        .where('cart_items.id = :id', { id })
        .execute();
    } else {
      return await this.cartItemRepository
        .createQueryBuilder('cart_items')
        .update(CartItem)
        .set({
          quantity: quantity - 1,
          total: total - total / quantity
        })
        .where('cart_items.id = :id', { id })
        .execute();
    }
  }

  async clearItemFromCart(userId: number, productId: number) {
    const { id } = await this.getOneCartItem(userId, productId);
    return await this.cartItemRepository
      .createQueryBuilder('cart_items')
      .delete()
      .from(CartItem)
      .where('cart_items.id = :id', { id })
      .execute();
  }
}
