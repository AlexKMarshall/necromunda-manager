import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createDatabase, dropDatabase } from 'pg-god';
import * as supertest from 'supertest';
import { FighterClassesModule } from './fighter-classes.module';
import { FighterClass } from './entities/fighter-class.entity';
import { buildCreateFighterClassDTO } from '../../test/utils/generator';

describe('Fighter Classes (e2e)', () => {
  let app: INestApplication;
  let databaseName: string;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    databaseName = `necromunda-${process.env.JEST_WORKER_ID}`;
    await createDatabase({ databaseName, errorIfExist: true });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        FighterClassesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          database: databaseName,
          entities: [FighterClass],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    request = await supertest(app.getHttpServer());
  });

  it('should allow CRUD of fighter classes', async () => {
    const endpoint = '/fighter-classes';
    const fighterClass = buildCreateFighterClassDTO();

    const createResponse = await request.post(endpoint).send(fighterClass);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toEqual(
      expect.objectContaining({ id: expect.any(String), ...fighterClass }),
    );

    const fighterClassId = createResponse.body.id;

    const initialReadResponse = await request.get(endpoint);

    expect(initialReadResponse.status).toBe(200);
    expect(initialReadResponse.body).toContainEqual(
      expect.objectContaining(fighterClass),
    );

    const updatedFighterClass = {
      ...fighterClass,
      name: `${fighterClass.name}-updated`,
    };
    const updateResponse = await request
      .put(`${endpoint}/${fighterClassId}`)
      .send(updatedFighterClass);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual({
      id: fighterClassId,
      ...updatedFighterClass,
    });

    const updatedReadResponse = await request.get(
      `${endpoint}/${fighterClassId}`,
    );

    expect(updatedReadResponse.status).toBe(200);
    expect(updatedReadResponse.body).toEqual(
      expect.objectContaining(updatedFighterClass),
    );

    const deleteResponse = await request.del(`${endpoint}/${fighterClassId}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual(
      expect.objectContaining(updatedFighterClass),
    );

    const deletedReadResponse = await request.get(endpoint);
    expect(deletedReadResponse.status).toBe(200);
    expect(deletedReadResponse.body).not.toContainEqual(
      expect.objectContaining(updatedFighterClass),
    );
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await dropDatabase({ databaseName, errorIfNonExist: true });
  });
});
