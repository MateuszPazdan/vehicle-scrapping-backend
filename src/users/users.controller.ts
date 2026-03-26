import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN, Role.USER])
  @Get('/me')
  getProfile(@Req() req) {
    return this.usersService.getUser({
      id: req.user.id as number,
    });
  }

  // @Get('/me')
  // @UseGuards(JwtAuthGuard)
  // getUser(@CurrentUser() user: User) {
  //   const { hashedPassword, ...userWithoutPassword } = user;
  //   return userWithoutPassword;
  // }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // async getUsers(@CurrentUser() user: User) {
  //   return await this.usersService.getUsers();
  // }
}
