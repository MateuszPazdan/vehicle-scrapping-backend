import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        hashedPassword,
        roles: ['USER'],
      },
    });

    return { id: user.id };
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findUser(email);
      const authenticated = await compare(password, user.hashedPassword);
      if (!authenticated) throw new UnauthorizedException();
      return { id: user.id };
    } catch {
      throw new UnauthorizedException('Niepoprawne dane uwierzytelniające');
    }
  }

  async login(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException();

    const payload: AuthJwtPayload = {
      sub: user.id,
      roles: user.roles,
    };

    const token = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.refreshTokenConfig.secret,
      expiresIn: this.refreshTokenConfig.expiresIn,
    });

    return {
      id: userId,
      token,
      refreshToken,
    };
  }

  async refreshToken(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException();

    const payload: AuthJwtPayload = {
      sub: user.id,
      roles: user.roles,
    };

    const token = this.jwtService.sign(payload);

    return {
      id: userId,
      token,
    };
  }

  verifyToken() {
    return true;
  }
}
