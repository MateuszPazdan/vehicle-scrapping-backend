import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OwnersService } from './owners.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateOwnerDto } from './dto/owners.dto';

@Controller('owners')
export class OwnersController {
  constructor(private readonly ownerService: OwnersService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createOwner(@Body() createOwnerDto: CreateOwnerDto) {
    await this.ownerService.createOwner(createOwnerDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllOwners() {
    return await this.ownerService.getAllOwners();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOwner(@Param('id') id: string) {
    return await this.ownerService.getOwner(+id);
  }
}
