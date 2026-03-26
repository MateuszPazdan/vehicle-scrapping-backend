import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as ms from 'ms';
import { StringValue } from 'ms';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { token, refreshToken } = await this.authService.login(
      req.user.id as number,
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: ms(this.configService.get('JWT_EXPIRE_IN') as StringValue),
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: ms(
        this.configService.get('REFRESH_JWT_EXPIRE_IN') as StringValue,
      ),
    });
  }

  @UseGuards(RefreshAuthGuard)
  @Post('/refresh')
  async refreshToken(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authService.refreshToken(
      req.user.id as number,
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: ms(this.configService.get('JWT_EXPIRE_IN') as StringValue),
    });
  }

  @Post('/verify')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  verifyToken() {
    return this.authService.verifyToken();
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
