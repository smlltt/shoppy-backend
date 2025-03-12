import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductRequest } from './dto/create-product.request';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(
    data: CreateProductRequest,
    userId: number,
  ): Promise<Product> {
    try {
      const payload = { ...data, userId };
      return await this.prismaService.product.create({
        data: payload,
        select: {
          name: true,
          description: true,
          price: true,
          userId: true,
          id: true,
        },
      });
    } catch (error) {
      console.log('error details', error);
    }
  }

  async getProducts(userId: number): Promise<Product[]> {
    return this.prismaService.product.findMany({
      where: { userId: Number(userId) },
    });
  }
}
