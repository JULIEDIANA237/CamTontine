import { PartialType } from '@nestjs/swagger';
import { CreateContributionCycleDto } from './create-contribution-cycle.dto';

export class UpdateContributionCycleDto extends PartialType(CreateContributionCycleDto) {}
