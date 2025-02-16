import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { LocalController } from './local.controller';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '@auth/jwt/jwt.strategy';
import { JwtAuthModule } from '@auth/jwt/jwt.module';

@Module({
  imports: [PassportModule, UsersModule, ConfigModule, JwtAuthModule],
  providers: [LocalStrategy, JwtStrategy, AuthService],
  controllers: [LocalController],
})
export class LocalModule {}
