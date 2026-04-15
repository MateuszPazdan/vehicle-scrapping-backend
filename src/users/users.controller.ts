import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateRolesDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.USER])
  @Get('/me')
  getProfile(@Req() req) {
    return this.usersService.getUser({
      id: req.user.id as number,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @Get('/all')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @Put('/roles')
  updateRoles(@Body() updateRolesDto: UpdateRolesDto, @Req() req) {
    if (updateRolesDto.id === req.user.id) {
      throw new BadRequestException('Nie można zmienić ról dla samego siebie');
    }
    return this.usersService.updateUser(
      updateRolesDto.id,
      updateRolesDto.roles,
    );
  }
}
