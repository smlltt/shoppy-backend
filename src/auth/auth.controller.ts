import { Controller, Request, Post, UseGuards, Res } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  //LocalAuthGuard invoked first: validates the user credential and attaches them to the request
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    //CurrentUser decorator extracts the user (attached to the req by LocalAuthGuard)
    @CurrentUser() user: Omit<User, 'password'>,
    //passthrough: true so that I can attached token later as httpOnly cookie
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }
}
