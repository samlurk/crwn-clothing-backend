import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from './request';

describe('Request', () => {
  let provider: RequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestService]
    }).compile();

    provider = module.get<RequestService>(RequestService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
