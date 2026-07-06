import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContributionCyclesService } from './contribution-cycles.service';
import { CreateContributionCycleDto } from './dto/create-contribution-cycle.dto';
import { UpdateContributionCycleDto } from './dto/update-contribution-cycle.dto';

@Controller('contribution-cycles')
export class ContributionCyclesController {
  constructor(private readonly contributionCyclesService: ContributionCyclesService) {}

  @Post()
  create(@Body() createContributionCycleDto: CreateContributionCycleDto) {
    return this.contributionCyclesService.create(createContributionCycleDto);
  }

  @Get()
  findAll() {
    return this.contributionCyclesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contributionCyclesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContributionCycleDto: UpdateContributionCycleDto) {
    return this.contributionCyclesService.update(+id, updateContributionCycleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contributionCyclesService.remove(+id);
  }
}
