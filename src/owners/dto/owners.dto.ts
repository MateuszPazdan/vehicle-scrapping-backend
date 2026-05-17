import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateOwnerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, {
    message: 'PESEL musi zawierać dokładnie 11 cyfr',
  })
  pesel: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}[0-9]{6}$/, {
    message: 'Numer dowodu musi mieć format: 3 wielkie litery i 6 cyfr',
  })
  id_number: string;
}

export class UpdateOwnerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  surname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pesel: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  id_number: string;
}

export class GetOwnersWithFiltersDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  surname?: string;

  @ApiProperty({ required: false })
  pesel?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  id_number?: string;
}
