import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { OwnersController } from './owners/owners.controller';
import { OwnersModule } from './owners/owners.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { WastesController } from './wastes/wastes.controller';
import { WastesService } from './wastes/wastes.service';
import { WastesModule } from './wastes/wastes.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, OwnersModule, VehiclesModule, WastesModule],
  controllers: [OwnersController, WastesController],
  providers: [WastesService],
})
export class AppModule {}
