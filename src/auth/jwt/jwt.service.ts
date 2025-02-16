import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { TokenPayload } from '@auth/token-payload.interface';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  login(user: Omit<User, 'password'>) {
    const payload: TokenPayload = { userId: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
