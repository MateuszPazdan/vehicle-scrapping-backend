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
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('/register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Body() dto: LoginDto,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, refreshToken } = await this.authService.login(
      req.user.id as number,
    );
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
    });

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

    return { roles: user?.roles };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('/refresh')
  async refreshToken(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authService.refreshToken(
      req.user.id as number,
    );
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
    }

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: ms(this.configService.get('JWT_EXPIRE_IN') as StringValue),
    });

    return { roles: user?.roles };
  }

  @Post('/verify')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Req() req) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
    });

    return { roles: user?.roles };
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
