import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUser(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) throw new NotFoundException('Użytkownik nieznaleziony');
    return user;
  }

  async getUser(query: Prisma.UserWhereInput) {
    const user = await this.prisma.user.findFirst({
      where: query,
      omit: {
        hashedPassword: true,
      },
    });
    if (!user) throw new NotFoundException('Użytkownik nieznaleziony');
    return user;
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      omit: {
        hashedPassword: true,
      },
    });
  }

  async updateUser(id: number, roles: Role[]) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        roles,
      },
      omit: {
        hashedPassword: true,
      },
    });
    if (!user) throw new NotFoundException('Użytkownik nieznaleziony');
  }
}
