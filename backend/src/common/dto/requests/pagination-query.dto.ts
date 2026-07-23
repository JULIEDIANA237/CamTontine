import { IntersectionType } from '@nestjs/swagger';

import { PaginationDto } from './pagination.dto';
import { SearchDto } from './search.dto';
import { SortDto } from './sort.dto';
import { StatusFilterDto } from './status-filter.dto';
import { ActiveFilterDto } from './active-filter.dto';
import { DateRangeDto } from './date-range.dto';

export class PaginationQueryDto extends IntersectionType(
    PaginationDto,
    SearchDto,
    SortDto,
    StatusFilterDto,
    ActiveFilterDto,
    DateRangeDto,
) { }