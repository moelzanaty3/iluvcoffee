import { PartialType } from '@nestjs/swagger';

export class Coffee {
  id: number;
  name: string;
  brand: string;
  flavors: string[];
}

// Create DTO class for creating a coffee
export class CreateCoffeeDto {
  readonly name: string;
  readonly brand: string;
  readonly flavors: string[];
}

// Create DTO class for updating a coffee using PartialType
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
