import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@Req() req) {
    return this.usersService.getUser({
      id: req.user.id,
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
