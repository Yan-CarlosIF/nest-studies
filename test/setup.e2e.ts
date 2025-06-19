import 'dotenv/config';

import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

import { PrismaClient } from '../prisma/generated/prisma/client';

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in the environment variables');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();
const databaseURL = generateUniqueDatabaseURL(schemaId);
process.env.DATABASE_URL = databaseURL;

const prisma = new PrismaClient();

beforeAll(() => {
  execSync(`pnpm prisma db push`, {
    env: {
      ...process.env,
      DATABASE_URL: databaseURL,
    },
    stdio: 'inherit',
  });
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
