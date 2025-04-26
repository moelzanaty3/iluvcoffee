import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import coffeeConfig from 'src/config/coffee.config';

import { BaseService } from '../common/services/base.service';
import { Event } from '../event/entities/event.entity';

import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { CoffeeRepository } from './repositories/coffee.repository';

@Injectable()
export class CoffeesService extends BaseService<
  Coffee,
  CreateCoffeeDto,
  UpdateCoffeeDto,
  CoffeeRepository
> {
  constructor(
    private readonly coffeeRepository: CoffeeRepository,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection,
    @Inject(coffeeConfig.KEY)
    private readonly coffeeConfiguration: ConfigType<typeof coffeeConfig>,
  ) {
    console.log(coffeeConfiguration.type);
    super(coffeeRepository);
  }

  /**
   * Increments the recommendation count for a coffee and records the recommendation event
   * @param coffee The coffee document to recommend
   */
  async recommendCoffee(coffee: Coffee) {
    // Start a MongoDB session for transaction management
    const session = await this.connection.startSession();
    // Begin a new transaction
    session.startTransaction();

    try {
      // Increment the recommendations counter
      coffee.recommendations++;

      // Create a new recommendation event document
      const recommendEvent = new this.eventModel({
        name: 'recommend_coffee',
        type: 'coffee',
        payload: { coffeeId: coffee.id as string },
      });

      // Save the event document within the transaction
      await recommendEvent.save({ session });
      // Save the updated coffee document within the transaction
      await coffee.save({ session });
      // Commit the transaction if both saves are successful
      await session.commitTransaction();
    } catch (error) {
      // Rollback the transaction if any error occurs
      await session.abortTransaction();
      // Re-throw the error to be handled by caller
      throw error;
    } finally {
      // Always end the session, regardless of success/failure
      await session.endSession();
    }
  }
}
