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
import { OwnerResponseDto } from './dto/owners.response.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('owners')
@Controller('owners')
export class OwnersController {
  constructor(private readonly ownerService: OwnersService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Creates a new owner',
    type: OwnerResponseDto,
  })
  async createOwner(@Body() createOwnerDto: CreateOwnerDto): Promise<OwnerResponseDto> {
    return await this.ownerService.createOwner(createOwnerDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Return a list of all owners',
    type: OwnerResponseDto,
    isArray: true,
  })
  async findAllOwners(): Promise<OwnerResponseDto[]> {
    return await this.ownerService.getAllOwners();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Return a single owner by id',
    type: OwnerResponseDto,
  })
  async findOwner(@Param('id') id: string): Promise<OwnerResponseDto> {
    return await this.ownerService.getOwner(+id);
  }
}
