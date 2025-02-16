import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from './local.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';

@Controller('auth/login/local')
export class LocalController {
  constructor(private authService: AuthService) {}

  //LocalAuthGuard invoked first: validates the user credential and attaches them to the request
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(
    //CurrentUser decorator extracts the user (attached to the req by LocalAuthGuard)
    @CurrentUser() user: Omit<User, 'password'>,
    //passthrough: true so that I can attached token later as httpOnly cookie
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }
}
