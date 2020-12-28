import { Test, TestingModule } from '@nestjs/testing';
import { GangsController } from './gangs.controller';
import { GangsService } from './gangs.service';

describe('GangsController', () => {
  let controller: GangsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GangsController],
      providers: [GangsService],
    }).compile();

    controller = module.get<GangsController>(GangsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
