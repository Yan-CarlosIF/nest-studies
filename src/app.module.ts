import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CreateAccountControler } from './controllers/create-account.controller';
import { envSchema } from './env';
import { PrismaService } from './lib/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  controllers: [CreateAccountControler],
  providers: [PrismaService],
})
export class AppModule {}
