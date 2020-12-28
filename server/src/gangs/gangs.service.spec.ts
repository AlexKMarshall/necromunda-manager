import { Test, TestingModule } from '@nestjs/testing';
import { GangsService } from './gangs.service';

describe('GangsService', () => {
  let service: GangsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GangsService],
    }).compile();

    service = module.get<GangsService>(GangsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
