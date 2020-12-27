import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createDatabase, dropDatabase } from 'pg-god';
import * as supertest from 'supertest';
import { FighterClassesModule } from '../fighter-classes/fighter-classes.module';
import { Faction } from '../factions/entities/faction.entity';
import { FactionsModule } from '../factions/factions.module';
import { FighterClass } from '../fighter-classes/entities/fighter-class.entity';
import { FactionsService } from '../factions/factions.service';
import { FighterClassesService } from '../fighter-classes/fighter-classes.service';
import { FighterPrototypesModule } from './fighter-prototypes.module';
import {
  buildCreateFactionDTO,
  buildCreateFighterClassDTO,
  buildCreateFighterPrototypeDTO,
} from '../../test/utils/generator';
import { FighterPrototype } from './entities/fighter-prototype.entity';

describe('Fighter Prototypes (e2e)', () => {
  let app: INestApplication;
  let databaseName: string;
  let request: supertest.SuperTest<supertest.Test>;
  let factionsService: FactionsService;
  let fighterClassesService: FighterClassesService;

  beforeAll(async () => {
    databaseName = `necromunda-${process.env.JEST_WORKER_ID}`;
    await createDatabase({ databaseName, errorIfExist: true });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        FighterClassesModule,
        FactionsModule,
        FighterPrototypesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          database: databaseName,
          entities: [Faction, FighterClass, FighterPrototype],
          synchronize: true,
        }),
      ],
    }).compile();

    factionsService = moduleFixture.get<FactionsService>(FactionsService);
    fighterClassesService = moduleFixture.get<FighterClassesService>(
      FighterClassesService,
    );

    app = moduleFixture.createNestApplication();
    await app.init();

    request = await supertest(app.getHttpServer());
  });

  it('should allow CRUD of fighter prototypes', async () => {
    const endpoint = '/fighter-prototypes';
    const faction = buildCreateFactionDTO();
    const fighterClass = buildCreateFighterClassDTO();
    const fighterPrototype = buildCreateFighterPrototypeDTO({
      faction,
      fighterClass,
    });

    await factionsService.create(faction);
    await fighterClassesService.create(fighterClass);

    const createResponse = await request.post(endpoint).send(fighterPrototype);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toEqual(
      expect.objectContaining({ id: expect.any(String), ...fighterPrototype }),
    );

    const fighterPrototypeId = createResponse.body.id;

    const initialReadResponse = await request.get(endpoint);
    expect(initialReadResponse.status).toBe(200);
    expect(initialReadResponse.body).toContainEqual(
      expect.objectContaining(fighterPrototype),
    );

    const updatedFighterPrototype = {
      name: `${fighterPrototype.name}-updated`,
    };
    const updateResponse = await request
      .put(`${endpoint}/${fighterPrototypeId}`)
      .send(updatedFighterPrototype);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual(
      expect.objectContaining(updatedFighterPrototype),
    );

    const updatedReadResponse = await request.get(
      `${endpoint}/${fighterPrototypeId}`,
    );

    expect(updatedReadResponse.status).toBe(200);
    expect(updatedReadResponse.body).toEqual(
      expect.objectContaining(updatedFighterPrototype),
    );

    const deleteResponse = await request.del(
      `${endpoint}/${fighterPrototypeId}`,
    );

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual(
      expect.objectContaining(updatedFighterPrototype),
    );

    const deletedReadResponse = await request.get(endpoint);

    expect(deletedReadResponse.status).toBe(200);
    expect(deletedReadResponse.body).not.toContainEqual(
      expect.objectContaining(updatedFighterPrototype),
    );
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await dropDatabase({ databaseName, errorIfNonExist: true });
  });
});
