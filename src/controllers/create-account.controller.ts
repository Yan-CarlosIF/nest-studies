import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';

type bodyResponse = {
  name: string;
  email: string;
  password: string;
};

@Controller('/accounts')
export class CreateAccountControler {
  constructor(private readonly prisma: PrismaService) {}

  @Post() // Já entende que http code é 201
  @HttpCode(201) // Mas é possivel especificar o http code
  async handle(@Body() body: bodyResponse) {
    const { name, email, password } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException('User with same e-mail already exists.');
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  }
}
