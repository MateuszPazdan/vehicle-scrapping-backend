import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStorageDto, UpdateStorageDto } from './dto/storage.dto';

@Injectable()
export class StoragesService {
  constructor(private prisma: PrismaService) {}

  async createStorage(createStorageDto: CreateStorageDto) {
    const existingStorage = await this.prisma.storageLocation.findUnique({
      where: {
        locationNr: createStorageDto.locationNr,
      },
    });
    if (existingStorage) {
      throw new ConflictException('Istnieje już lokalizacja o podanym numerze');
    }

    const wasteType = await this.prisma.wasteType.findUnique({
      where: {
        id: createStorageDto.wasteTypeId,
      },
    });
    if (!wasteType) {
      throw new ConflictException('Nie znaleziono odpadu o podanym id');
    }

    return await this.prisma.storageLocation.create({
      data: {
        locationNr: createStorageDto.locationNr,
        wasteTypeId: createStorageDto.wasteTypeId,
        currentMass: 0,
      },
      include: {
        wasteType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        wasteTypeId: true,
      },
    });
  }

  async getAllStorages() {
    return await this.prisma.storageLocation.findMany({
      include: {
        wasteType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        wasteTypeId: true,
      },
      orderBy: {
        locationNr: 'asc',
      },
    });
  }

  async updateStorage(id: number, updateStorageDto: UpdateStorageDto) {
    const existingStorage = await this.prisma.storageLocation.findUnique({
      where: {
        locationNr: updateStorageDto.locationNr,
      },
    });
    if (existingStorage) {
      throw new ConflictException('Istnieje już lokalizacja o podanym numerze');
    }

    const storage = await this.prisma.storageLocation.findUnique({
      where: {
        id,
      },
    });

    if (!storage) {
      throw new ConflictException('Nie znaleziono lokalizacji o podanym id');
    }

    return await this.prisma.storageLocation.update({
      where: {
        id,
      },
      data: {
        locationNr: updateStorageDto.locationNr,
      },
      include: {
        wasteType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        wasteTypeId: true,
      },
    });
  }
}
