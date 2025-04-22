import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/event/entities/event.entity';

import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeModel.findOne({ _id: id }).exec();
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
    const coffee = new this.coffeeModel(createCoffeeDto);
    return coffee.save();
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const updatedCoffee = await this.coffeeModel
      .findOneAndUpdate(
        { _id: id },
        { ...updateCoffeeDto },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedCoffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return updatedCoffee;
  }

  async delete(id: string) {
    const coffee = await this.coffeeModel.findOneAndDelete({ _id: id }).exec();

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return {
      message: `Coffee ${coffee.name} (ID: ${coffee.id}) was successfully deleted`,
    };
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
