import { Controller, Res, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get()
  async auth(@Res() res) {
    return res.redirect('/auth/login/local');
  }
}
