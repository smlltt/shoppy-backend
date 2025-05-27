import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  Query,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Param,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { CreateProductRequest } from './dto/create-product.request';
import { JWTAuthGuard } from '@auth/jwt/jwt.guard';
import { CurrentUser } from '@auth/current-user.decorator';
import { TokenPayload } from '@auth/token-payload.interface';
import { PaginationDto } from './dto/pagination';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PRODUCT_IMAGES } from './product-images';

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
  @Post(':productId/image')
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: PRODUCT_IMAGES,
        filename: (req, file, callback) => {
          const filename = `${req.params.productId}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
    }),
  )
  uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    _file: Express.Multer.File,
  ) {}

  //in real case, I would do something like this:
  //update so s3, or google cloud etc., then update product in db with imageUrl

  // @Post(':productId/image')
  // @UseGuards(JWTAuthGuard)
  // @UseInterceptors(FileInterceptor('image'))
  // async uploadProductImage(
  //   @Param('productId') productId: number,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 500000 }),
  //         new FileTypeValidator({ fileType: 'image/jpeg' }),
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   const imageUrl = await this.awsS3Service.uploadFile(file, productId);

  //   await this.productsService.updateProductImage(productId, imageUrl);

  //   return { imageUrl };
  // }

  @Get()
  @UseGuards(JWTAuthGuard)
  getProducts(
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: string,
  ) {
    return this.productsService.getProducts(paginationDto, status);
  }

  @Get(':productId')
  @UseGuards(JWTAuthGuard)
  getProduct(@Param('productId') productId: number) {
    return this.productsService.getProduct(productId);
  }
}
