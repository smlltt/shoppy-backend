import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//used to verifying login credentials
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
