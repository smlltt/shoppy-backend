import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { Response } from 'express';
import ms, { StringValue } from 'ms';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { JwtAuthService } from './jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtAuthService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.usersService.getUser({ email });
      const authenticated = await bcrypt.compare(pass, user.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      const { password, ...result } = user;
      return result;
    } catch (err) {
      throw new UnauthorizedException('Credentials are not valid');
    }
  }

  async login(user: Omit<User, 'password'>, response: Response) {
    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(this.configService.getOrThrow<StringValue>('JWT_EXPIRATION')),
    );
    const { token } = this.jwtService.login(user);
    response.cookie('Authentication', token, {
      httpOnly: true,
      secure: true,
      expires,
    });
    return { user: user.id };
  }
}
