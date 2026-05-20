import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
        prisma = app.get(PrismaService);
    });

    afterAll(async () => {
        await app.close();
    });

    it('registers and logs in a user', async () => {
        const email = `e2e+${Date.now()}@example.com`;
        const password = 'password123';
        const res = await request(app.getHttpServer()).post('/api/auth/register').send({ email, password });
        expect([200, 201]).toContain(res.status);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.email).toBe(email);

        const login = await request(app.getHttpServer()).post('/api/auth/login').send({ email, password });
        expect([200, 201]).toContain(login.status);
        expect(login.body.tokens).toBeDefined();
        expect(login.body.tokens.accessToken).toBeDefined();
    });
});
