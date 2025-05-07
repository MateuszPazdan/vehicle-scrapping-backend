import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddVehicleToDismantlingDto,
  GetAllVehiclesWithFiltersDto,
  GetFilterInfoDto,
} from './dto/vehicles.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async addVehicleToDismantling(
    addVehicleToDismantlingDto: AddVehicleToDismantlingDto,
  ) {
    const existingVehicleByVin = await this.prisma.vehicle.findUnique({
      where: {
        vin: addVehicleToDismantlingDto.vin,
      },
    });

    if (existingVehicleByVin)
      throw new Error('Pojazd z takim numerem VIN już istnieje.');

    const existingVehicleByRegistrationNumber =
      await this.prisma.vehicle.findUnique({
        where: {
          registration_number: addVehicleToDismantlingDto.registration_number,
        },
      });

    if (existingVehicleByRegistrationNumber)
      throw new Error(
        'Pojazd z takim numerem dowodu rejestracyjnego już istnieje.',
      );

    return await this.prisma.vehicle.create({
      data: {
        brand: addVehicleToDismantlingDto.brand,
        model: addVehicleToDismantlingDto.model,
        registration_certificate_number:
          addVehicleToDismantlingDto.registration_certificate_number,
        registration_number: addVehicleToDismantlingDto.registration_number,
        vin: addVehicleToDismantlingDto.vin,
        weight: addVehicleToDismantlingDto.weight,
        year_of_production: addVehicleToDismantlingDto.year_of_production,
        price: addVehicleToDismantlingDto.price,
        owners: {
          connectOrCreate: addVehicleToDismantlingDto.owners.map((owner) => ({
            where: { pesel: owner.pesel },
            create: {
              name: owner.name,
              surname: owner.surname,
              pesel: owner.pesel,
              address: owner.address,
              id_number: owner.id_number,
            },
          })),
        },
      },
    });
  }

  async getAllVehiclesWithFilters(params: GetAllVehiclesWithFiltersDto) {
    const { brand, model, registration_number, vin, year_of_production } =
      params;

    return await this.prisma.vehicle.findMany({
      where: {
        ...(brand && { brand: { contains: brand, mode: 'insensitive' } }),
        ...(model && { model: { contains: model, mode: 'insensitive' } }),
        ...(registration_number && {
          registration_number: {
            contains: registration_number,
            mode: 'insensitive',
          },
        }),
        ...(vin && { vin: { contains: vin, mode: 'insensitive' } }),
        ...(year_of_production && {
          year_of_production: Number(year_of_production),
        }),
      },
    });
  }

  async getFilterInfo(filterInfo?: GetFilterInfoDto) {
    const brands = await this.prisma.vehicle.findMany({
      select: {
        brand: true,
      },
      distinct: ['brand'],
    });

    if (filterInfo?.brand !== '') {
      const filteredModels = await this.prisma.vehicle.findMany({
        where: {
          brand: { equals: filterInfo?.brand },
        },
        select: {
          model: true,
        },
        distinct: ['model'],
      });

      return {
        brands: brands.map((b) => b.brand),
        models: filteredModels.map((m) => m.model),
      };
    }

    const models = await this.prisma.vehicle.findMany({
      select: {
        model: true,
      },
      distinct: ['model'],
    });

    return {
      brands: brands.map((b) => b.brand),
      models: models.map((m) => m.model),
    };
  }
}
