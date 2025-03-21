import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOwnerDto } from './dto/owners.dto';

@Injectable()
export class OwnersService {
  constructor(private prisma: PrismaService) {}

  async createOwner(createOwnerDto: CreateOwnerDto) {
    return await this.prisma.owner.create({
      data: {
        name: createOwnerDto.name,
        surname: createOwnerDto.surname,
        address: createOwnerDto.address,
        pesel: createOwnerDto.pesel,
        id_number: createOwnerDto.Id_number,
      },
    });
  }

  async getAllOwners() {
    return await this.prisma.owner.findMany();
  }

  async getOwner(id: number) {
    const user = await this.prisma.owner.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('Nie znaleziono użytkownika.');

    return user;
  }
}
