import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOwnerDto } from './dto/owners.dto';

@Injectable()
export class OwnersService {
  constructor(private prisma: PrismaService) {}

  async createOwner(createOwnerDto: CreateOwnerDto) {
    if (!/^\d{11}$/.test(createOwnerDto.pesel)) {
      throw new BadRequestException(
        'Niepoprawny format peselu. Musi składać się z 11 znaków',
      );
    }
    const existingPesel = await this.prisma.owner.findUnique({
      where: { pesel: createOwnerDto.pesel },
    });
    if (existingPesel) {
      throw new ConflictException('Kontrahent z takim peselem już istnieje.');
    }
    const existingIdNumber = await this.prisma.owner.findUnique({
      where: { id_number: createOwnerDto.id_number },
    });

    if (existingIdNumber) {
      throw new ConflictException(
        'Kontrahent z takim numerem dowodu już istnieje.',
      );
    }
    return await this.prisma.owner.create({
      data: {
        name: createOwnerDto.name,
        surname: createOwnerDto.surname,
        address: createOwnerDto.address,
        pesel: createOwnerDto.pesel,
        id_number: createOwnerDto.id_number,
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
