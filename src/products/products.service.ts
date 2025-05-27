import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductRequest } from './dto/create-product.request';
import { Product } from '@prisma/client';
import { PaginationDto } from './dto/pagination';
import { Prisma } from '@prisma/client';
import { promises as fs } from 'fs';
import { join } from 'path';
import { PRODUCT_IMAGES } from './product-images';
import { ProductsGateway } from './products-gateway';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsGateway: ProductsGateway,
  ) {}

  async createProduct(
    data: CreateProductRequest,
    userId: number,
  ): Promise<Omit<Product, 'createdAt' | 'updatedAt'> | undefined> {
    try {
      const payload = { ...data, sold: false, userId };

      const product = await this.prismaService.product.create({
        data: payload,
        select: {
          name: true,
          description: true,
          price: true,
          userId: true,
          id: true,
          sold: true,
        },
      });
      this.productsGateway.handleProductUpdated();
      return product;
    } catch (error) {
      console.log('error details', error);
    }
  }

  async getProducts(
    pagination: PaginationDto,
    status?: string,
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
      where: {
        sold: status === 'available' ? false : true,
      },

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

  async getProduct(productId: number): Promise<{
    data: Omit<Product, 'userId'>;
  }> {
    try {
      const product = {
        ...(await this.prismaService.product.findUniqueOrThrow({
          where: { id: Number(productId) },
        })),
        hasImage: await this.imageEsists(Number(productId)),
      };

      return {
        data: product,
      };
    } catch (error) {
      throw new NotFoundException(`Product not found with id ${productId}`);
    }
  }

  async updateProduct(productId: number, data: Prisma.ProductUpdateInput) {
    const product = await this.prismaService.product.update({
      where: { id: Number(productId) },
      data,
    });
    this.productsGateway.handleProductUpdated();
    return product;
  }

  private async imageEsists(productId: number) {
    try {
      await fs.access(
        join(`${PRODUCT_IMAGES}/${productId}.jpg`),
        fs.constants.F_OK,
      );
      return true;
    } catch (e) {
      return false;
    }
  }
}
