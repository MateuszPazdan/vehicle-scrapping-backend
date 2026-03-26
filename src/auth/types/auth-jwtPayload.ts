import { Role } from '@prisma/client';

export type AuthJwtPayload = {
  sub: number;
  roles: Role[];
};
