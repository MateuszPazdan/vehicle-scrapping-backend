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
import { StoragesController } from './storages/storages.controller';
import { StoragesService } from './storages/storages.service';
import { StoragesModule } from './storages/storages.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, OwnersModule, VehiclesModule, WastesModule, StoragesModule],
  controllers: [OwnersController, WastesController, StoragesController],
  providers: [WastesService, StoragesService],
})
export class AppModule {}
