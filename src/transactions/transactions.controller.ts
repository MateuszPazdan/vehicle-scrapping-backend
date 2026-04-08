import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/transaction.dto';
import { ApiResponse } from '@nestjs/swagger';
import { TransactionResponseDto } from './dto/transaction.response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.EMPLOYEE])
  @ApiResponse({
    status: 201,
    description: 'Create and return a new transaction',
    type: TransactionResponseDto,
  })
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionsService.createTransaction(
      createTransactionDto,
    );
  }

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.EMPLOYEE])
  @ApiResponse({
    status: 200,
    description: 'Return a list of all transactions',
    type: TransactionResponseDto,
    isArray: true,
  })
  async returnAllTransactions() {
    return await this.transactionsService.returnAllTransactions();
  }
}
