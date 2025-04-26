import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from '../../common/repositories/base.repository';
import { CreateCoffeeDto } from '../dto/create-coffee.dto';
import { UpdateCoffeeDto } from '../dto/update-coffee.dto';
import { Coffee } from '../entities/coffee.entity';

@Injectable()
export class CoffeeRepository extends BaseRepository<
  Coffee,
  CreateCoffeeDto,
  UpdateCoffeeDto
> {
  constructor(@InjectModel(Coffee.name) coffeeModel: Model<Coffee>) {
    super(coffeeModel);
  }

  async findByName(name: string): Promise<Coffee | null> {
    return this.findOneByQuery({ name });
  }
}
