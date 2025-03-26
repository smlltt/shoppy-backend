import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { CreateProductRequest } from './dto/create-product.request';
import { JWTAuthGuard } from '@auth/jwt/jwt.guard';
import { CurrentUser } from '@auth/current-user.decorator';
import { TokenPayload } from '@auth/token-payload.interface';
import { PaginationDto } from './dto/pagination';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Post()
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  createProduct(
    @Body() body: CreateProductRequest,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.productsService.createProduct(body, user.userId);
  }

  @Get()
  @UseGuards(JWTAuthGuard)
  getProducts(
    @CurrentUser() user: TokenPayload,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.productsService.getProducts(user.userId, paginationDto);
  }
}
