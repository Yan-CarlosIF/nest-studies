import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/lib/prisma.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { z } from 'zod';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1, 'Page must be a positive number'));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParam = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParam) {
    const perPage = 20; // Número de perguntas por página

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage, // Pula o número de registros necessário para a página solicitada
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { questions };
  }
}
