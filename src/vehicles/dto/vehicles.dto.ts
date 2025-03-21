import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateOwnerDto } from 'src/owners/dto/owners.dto';

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
  year_of_production: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  vin: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  registration_number: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  registration_certificate_number: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  weight: number;
  @ApiProperty({ type: () => CreateOwnerDto, isArray: true })
  @IsNotEmpty()
  owners: CreateOwnerDto[];
}
