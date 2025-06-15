import { Module } from '@nestjs/common';

import { CreateAccountControler } from './controllers/create-account.controller';
import { PrismaService } from './lib/prisma.service';

@Module({
  imports: [],
  controllers: [CreateAccountControler],
  providers: [PrismaService],
})
export class AppModule {}
