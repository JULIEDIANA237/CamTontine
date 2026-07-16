import { Test, TestingModule } from '@nestjs/testing';
import { MembershipsService } from './memberships.service';
import { PrismaService } from '../prisma/prisma.service';
import { MembershipMapper } from './mappers/membership.mapper';

describe('MembershipsService', () => {
  let service: MembershipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipsService,
        {
          provide: PrismaService,
          useValue: {
            membership: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            $transaction: jest.fn((cb) => cb(PrismaService)),
          },
        },
        {
          provide: MembershipMapper,
          useValue: {
            toResponse: jest.fn(),
            toList: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MembershipsService>(MembershipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
