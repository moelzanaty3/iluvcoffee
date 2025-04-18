import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';

// Create DTO class for creating a coffee
export class CreateCoffeeDto {
  readonly name: string;
  readonly brand: string;
  readonly flavors: string[];
}

// Create DTO class for updating a coffee using PartialType
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}

@Controller('coffees')
export class CoffeesController {
  @Get()
  findAll(@Query() paginationQuery: { limit: number; offset: number }) {
    const { limit, offset } = paginationQuery;
    return `This action returns all coffees. Limit ${limit}, Offset: ${offset}`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} coffee`;
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return createCoffeeDto;
    // This action adds a new coffee
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return `This action updates a #${id} coffee`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} coffee`;
  }
}
