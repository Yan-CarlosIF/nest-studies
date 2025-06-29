import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/lib/prisma.service';
import request from 'supertest';
import { App } from 'supertest/types';

describe('Fetch Recent Questions (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'KQ2d0@example.com',
        password: '123456',
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    await prisma.question.createMany({
      data: Array.from({ length: 2 }, (_, index) => ({
        title: `Question ${index}`,
        slug: `question-${index}`,
        content: 'Question content',
        authorId: user.id,
      })),
    });

    const response = await request(app.getHttpServer() as App)
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 0' }),
        expect.objectContaining({ title: 'Question 1' }),
      ],
    });
  });
});
