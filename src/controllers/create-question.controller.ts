import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UserPayload } from 'src/auth/jwt.strategy';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/lib/prisma.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const bodyValidation = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidation) body: CreateQuestionBody,
  ) {
    const { content, title } = body;
    const { sub: authorId } = user;
    const slug = this.convertToSlug(title);

    await this.prisma.question.create({
      data: {
        title,
        content,
        authorId,
        slug,
      },
    });
  }

  private convertToSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^\w\s-]/g, '') // Remove non-word characters
      .replace(/\s+/g, '-'); // Replace spaces with hyphens
  }
}
