import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWasteDto } from './dto/wastes.dto';

@Injectable()
export class WastesService {
  constructor(private prisma: PrismaService) {}

  async createWaste(createWasteDto: CreateWasteDto) {
    return await this.prisma.wasteType.create({
      data: {
        name: createWasteDto.name,
        pricePerKg: createWasteDto.pricePerKg,
      },
    });
  }

  async getAllWastes() {
    return await this.prisma.wasteType.findMany();
  }

  async deleteWaste(id: number) {
    const waste = await this.prisma.wasteType.findUnique({
      where: {
        id,
      },
    });

    if (!waste) {
      throw new NotFoundException('Nie znaleziono odpadu o podanym id');
    }

    return await this.prisma.wasteType.delete({
      where: {
        id,
      },
    });
  }

  async updateWaste(id: number, updateWasteDto: CreateWasteDto) {
    const waste = await this.prisma.wasteType.findUnique({
      where: {
        id,
      },
    });

    if (!waste) {
      throw new NotFoundException('Nie znaleziono odpadu o podanym id');
    }

    return await this.prisma.wasteType.update({
      where: {
        id,
      },
      data: {
        name: updateWasteDto.name,
        pricePerKg: updateWasteDto.pricePerKg,
      },
    });
  }
}
