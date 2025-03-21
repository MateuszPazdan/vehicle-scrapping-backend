import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { OwnersController } from './owners/owners.controller';
import { OwnersModule } from './owners/owners.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, OwnersModule],
  controllers: [OwnersController],
})
export class AppModule {}
