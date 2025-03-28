import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductRequest } from './dto/create-product.request';
import { Product } from '@prisma/client';
import { PaginationDto } from './dto/pagination';
import { Prisma } from '@prisma/client';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(
    data: CreateProductRequest,
    userId: number,
  ): Promise<Omit<Product, 'createdAt' | 'updatedAt'> | undefined> {
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

  async getProducts(
    userId: number,
    pagination: PaginationDto,
  ): Promise<{
    pagination: { total: number };
    data: Omit<Product, 'userId'>[];
  }> {
    const query: Prisma.ProductFindManyArgs = {
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
      skip: pagination?.page * 6 || 0,
      where: { userId },
      omit: {
        userId: true,
      },
    };
    const [products, count] = await this.prismaService.$transaction([
      this.prismaService.product.findMany(query),
      this.prismaService.product.count({ where: query.where }),
    ]);

    const mappedProducts = await Promise.all(
      products.map(async (item) => {
        return {
          ...item,
          hasImage: await this.imageEsists(item.id),
        };
      }),
    );

    return {
      pagination: {
        total: count,
      },
      data: mappedProducts,
    };
  }

  private async imageEsists(productId: number) {
    try {
      await fs.access(
        join(__dirname, '../../', `public/products/${productId}.jpg`),
        fs.constants.F_OK,
      );
      return true;
    } catch (e) {
      return false;
    }
  }
}
