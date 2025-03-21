import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { OwnersController } from './owners/owners.controller';
import { OwnersModule } from './owners/owners.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, OwnersModule, VehiclesModule],
  controllers: [OwnersController],
})
export class AppModule {}
