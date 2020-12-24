import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createDatabase, dropDatabase } from 'pg-god';
import * as supertest from 'supertest';
import { FactionsModule } from './factions.module';
import { Faction } from './entities/faction.entity';

describe('AppController (e2e)', () => {
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
        FactionsModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          database: databaseName,
          entities: [Faction],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    request = await supertest(app.getHttpServer());
  });

  it('should allow CRUD of factions', async () => {
    const endpoint = '/factions';
    const faction = { name: 'Goliath' };
    const createResponse = await request.post(endpoint).send(faction);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toEqual(
      expect.objectContaining({ id: expect.any(String), ...faction }),
    );

    const factionId = createResponse.body.id;

    const initialReadResponse = await request.get(endpoint);

    expect(initialReadResponse.status).toBe(200);
    expect(initialReadResponse.body).toContainEqual(
      expect.objectContaining(faction),
    );

    const updatedFaction = { name: 'UpdatedGoliath' };

    const updateResponse = await request
      .put(`${endpoint}/${factionId}`)
      .send(updatedFaction);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual({ id: factionId, ...updatedFaction });

    const updatedReadResponse = await request.get(endpoint);

    expect(updatedReadResponse.status).toBe(200);
    expect(updatedReadResponse.body).toContainEqual(
      expect.objectContaining(updatedFaction),
    );

    const deleteResponse = await request.del(`${endpoint}/${factionId}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual(
      expect.objectContaining(updatedFaction),
    );

    const deletedReadResponse = await request.get(endpoint);

    expect(deletedReadResponse.status).toBe(200);
    expect(deletedReadResponse.body).not.toContainEqual(
      expect.objectContaining(updatedFaction),
    );
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await dropDatabase({ databaseName, errorIfNonExist: true });
  });
});
