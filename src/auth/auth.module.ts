import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalModule } from './local/local.module';
import { JwtAuthModule } from './jwt/jwt.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [LocalModule, UsersModule, JwtAuthModule],
})
export class AuthModule {}
