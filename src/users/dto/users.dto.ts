import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UpdateRolesDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  roles: Role[];
}
