import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import {
  AddVehicleToDismantlingDto,
  GetAllVehiclesWithFiltersDto,
  GetFilterInfoDto,
} from './dto/vehicles.dto';
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
  async getAllVehiclesWithFilters(
    @Query()
    params: GetAllVehiclesWithFiltersDto,
  ) {
    return await this.vehiclesService.getAllVehiclesWithFilters(params);
  }

  @Get('filter_input')
  @UseGuards(JwtAuthGuard)
  async getFilterInput(@Query() filterInfo?: GetFilterInfoDto) {
    return await this.vehiclesService.getFilterInfo(filterInfo);
  }
}
