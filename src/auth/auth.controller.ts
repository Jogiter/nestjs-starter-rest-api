import {
  Req,
  Post,
  Body,
  UseGuards,
  Controller,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { LoginOutput, LoginInput } from './dto/login.dto';
import { RegisterInput, RegisterOutput } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginOutput,
  })
  @UseGuards(AuthGuard('local'))
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @Req() req: Request,
    @Body() credential: LoginInput,
  ): Promise<LoginOutput> {
    return this.authService.login(req.user as User);
  }

  @Post('register')
  async registerLocal(@Body() input: RegisterInput): Promise<RegisterOutput> {
    return this.authService.register(input);
  }
}
