import { ApiProperty } from '@nestjs/swagger';
import { VehicleStatus } from '@prisma/client';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class AddVehicleToDismantlingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  brand: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  model: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  year_of_production: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-HJ-NPR-Z0-9]{17}$/, {
    message: 'VIN musi zawierać dokładnie 17 znaków (bez I, O, Q)',
  })
  vin: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z]{1,3}[A-Z0-9]{4,5}$/, {
    message: 'Niepoprawny numer rejestracyjny',
  })
  registration_number: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z0-9/]{5,20}$/, {
    message: 'Numer dowodu rejestracyjnego ma niepoprawny format',
  })
  registration_certificate_number: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  weight: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @ApiProperty({ type: String, isArray: true })
  @ArrayNotEmpty()
  @Matches(/^\d{11}$/, {
    each: true,
    message: 'Each owner must be a valid 11-digit PESEL number',
  })
  @IsNotEmpty()
  owners: string[];
}

export class GetAllVehiclesWithFiltersDto {
  @ApiProperty({ required: false })
  brand?: string;

  @ApiProperty({ required: false })
  model?: string;

  @ApiProperty({ required: false })
  year_of_production?: string;

  @ApiProperty({ required: false })
  registration_number?: string;

  @ApiProperty({ required: false })
  vin?: string;

  @ApiProperty({
    required: false,
    enum: VehicleStatus,
  })
  vehicle_status?: VehicleStatus;

  @ApiProperty({ required: false })
  owner_pesel?: string;
}

export class GetFilterInfoDto {
  @ApiProperty({ required: false })
  brand?: string;
}
