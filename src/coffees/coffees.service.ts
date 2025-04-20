import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
  private readonly coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    const coffee = this.coffees.find((coffee) => coffee.id === +id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    const newCoffee = {
      id: Date.now(),
      ...createCoffeeDto,
    };
    this.coffees.push(newCoffee);
    return newCoffee;
  }

  update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      if (updateCoffeeDto.name) {
        existingCoffee.name = updateCoffeeDto.name;
      }
      if (updateCoffeeDto.brand) {
        existingCoffee.brand = updateCoffeeDto.brand;
      }
      if (updateCoffeeDto.flavors) {
        existingCoffee.flavors = updateCoffeeDto.flavors;
      }
    }
    return existingCoffee;
  }

  delete(id: string) {
    const coffeeIndex = this.coffees.findIndex((coffee) => coffee.id === +id);
    if (coffeeIndex >= 0) {
      const deletedCoffee = this.coffees[coffeeIndex];
      this.coffees.splice(coffeeIndex, 1);
      return {
        message: `Coffee ${deletedCoffee.name} (ID: ${deletedCoffee.id}) was successfully deleted`,
      };
    }
    throw new NotFoundException(`Coffee #${id} not found`);
  }
}
