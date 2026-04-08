import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto, GetOwnersWithFiltersDto } from './dto/owners.dto';
import { OwnerResponseDto } from './dto/owners.response.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('owners')
@Controller('owners')
export class OwnersController {
  constructor(private readonly ownerService: OwnersService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.EMPLOYEE])
  @ApiResponse({
    status: 201,
    description: 'Return a new owner',
    type: OwnerResponseDto,
  })
  async createOwner(
    @Body() createOwnerDto: CreateOwnerDto,
  ): Promise<OwnerResponseDto> {
    return await this.ownerService.createOwner(createOwnerDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.EMPLOYEE])
  @ApiResponse({
    status: 200,
    description: 'Return a list of owners with filters',
    type: OwnerResponseDto,
    isArray: true,
  })
  async findAllOwners(
    @Query() params: GetOwnersWithFiltersDto,
  ): Promise<OwnerResponseDto[]> {
    return await this.ownerService.getOwners(params);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.EMPLOYEE])
  @ApiResponse({
    status: 200,
    description: 'Return a single owner by id',
    type: OwnerResponseDto,
  })
  async findOwner(@Param('id') id: string): Promise<OwnerResponseDto> {
    return await this.ownerService.getOwner(+id);
  }
}
