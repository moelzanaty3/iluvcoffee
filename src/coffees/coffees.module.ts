import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import coffeeConfig from 'src/config/coffee.config';

import { Event, EventSchema } from '../event/entities/event.entity';

import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee, CoffeeSchema } from './entities/coffee.entity';
import { CoffeeRepository } from './repositories/coffee.repository';

@Module({
  imports: [
    ConfigModule.forFeature(coffeeConfig),
    MongooseModule.forFeature([
      { name: Coffee.name, schema: CoffeeSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [CoffeesController],
  providers: [CoffeesService, CoffeeRepository],
})
export class CoffeesModule {}
