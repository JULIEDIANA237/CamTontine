import { Injectable } from '@nestjs/common';
import { CreateContributionCycleDto } from './dto/create-contribution-cycle.dto';
import { UpdateContributionCycleDto } from './dto/update-contribution-cycle.dto';

@Injectable()
export class ContributionCyclesService {
  create(createContributionCycleDto: CreateContributionCycleDto) {
    return 'This action adds a new contributionCycle';
  }

  findAll() {
    return `This action returns all contributionCycles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contributionCycle`;
  }

  update(id: number, updateContributionCycleDto: UpdateContributionCycleDto) {
    return `This action updates a #${id} contributionCycle`;
  }

  remove(id: number) {
    return `This action removes a #${id} contributionCycle`;
  }
}
