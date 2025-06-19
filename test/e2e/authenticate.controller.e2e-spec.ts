import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/lib/prisma.service';
import request from 'supertest';
import { App } from 'supertest/types';

describe('Create Account (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /accounts', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'KQ2d0@example.com',
        password: await hash('123456', 8),
      },
    });

    const response = await request(app.getHttpServer() as App)
      .post('/sessions')
      .send({
        email: 'KQ2d0@example.com',
        password: '123456',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ accessToken: expect.any(String) });
  });
});
