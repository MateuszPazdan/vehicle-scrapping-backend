import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { AddVehicleToDismantlingDto } from './dto/vehicles.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async addVehicleToDismantling(
    @Body() addVehicleToDismantlingDto: AddVehicleToDismantlingDto,
  ) {
    return this.vehiclesService.addVehicleToDismantling(
      addVehicleToDismantlingDto,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllVehicles() {
    return await this.vehiclesService.getAllVehicles();
  }
}
