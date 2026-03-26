import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

  async getUsers() {
    return this.prisma.user.findMany();
  }
}
