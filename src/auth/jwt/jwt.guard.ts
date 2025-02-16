import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//used to verify jwt validity (so protected routes)
@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {}
