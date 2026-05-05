import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';

describe('Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('should register user', async () => {
    const res = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test@test.com',
      password: 'Test123!',
    });

    expect(res.status).toBe(201);
  });

  it('should login user and set cookies', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'test@test.com',
      password: 'Test123!',
    });

    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should block access without token', async () => {
    const res = await request(app.getHttpServer()).post('/auth/verify');

    expect(res.status).toBe(401);
  });
});
