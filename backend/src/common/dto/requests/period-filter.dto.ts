import { IntersectionType } from '@nestjs/swagger';

import { MonthFilterDto } from './month-filter.dto';
import { YearFilterDto } from './year-filter.dto';

export class PeriodFilterDto extends IntersectionType(
    YearFilterDto,
    MonthFilterDto,
) { }