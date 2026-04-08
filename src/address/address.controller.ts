import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.EMPLOYEE])
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  async getAddress(@Query('address') address: string) {
    return await this.addressService.getFormattedAddress(address);
  }
}
