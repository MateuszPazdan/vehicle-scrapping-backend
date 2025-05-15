import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { WastesService } from './wastes.service';
import { CreateWasteDto } from './dto/wastes.dto';
import { ApiResponse } from '@nestjs/swagger';
import { WasteResponseDto } from './dto/wastes.response.dto';

@Controller('wastes')
export class WastesController {
  constructor(private readonly wasteService: WastesService) {}

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create and return a new waste type',
    type: WasteResponseDto,
  })
  async createWaste(@Body() createWasteDto: CreateWasteDto) {
    return await this.wasteService.createWaste(createWasteDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return a list of all waste types',
    type: WasteResponseDto,
    isArray: true,
  })
  async getAllWastes() {
    return await this.wasteService.getAllWastes();
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Delete a waste type by id',
    type: WasteResponseDto,
  })
  async deleteWaste(@Param('id') id: string) {
    return await this.wasteService.deleteWaste(+id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Update and return a waste type by id',
    type: WasteResponseDto,
  })
  async updateWaste(
    @Param('id') id: string,
    @Body() updateWasteDto: CreateWasteDto,
  ) {
    return await this.wasteService.updateWaste(+id, updateWasteDto);
  }
}
