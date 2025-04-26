import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

import { PaginationQueryDto } from '../dto/pagination-query.dto';

export type BaseDocument = Document;

export interface Repository<T extends BaseDocument, CreateDTO, UpdateDTO> {
  findAll(paginationQuery: PaginationQueryDto): Promise<T[]>;
  findOne(id: string): Promise<T>;
  create(createDto: CreateDTO): Promise<T>;
  update(id: string, updateDto: UpdateDTO): Promise<T>;
  delete(id: string): Promise<{ message: string }>;
}

export abstract class BaseRepository<
  T extends BaseDocument,
  CreateDTO,
  UpdateDTO,
> implements Repository<T, CreateDTO, UpdateDTO>
{
  constructor(protected readonly model: Model<T>) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<T[]> {
    const { limit, offset } = paginationQuery;
    return this.model.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: string): Promise<T> {
    const document = await this.model.findById(id).exec();
    if (!document) {
      throw new Error(`Document with id ${id} not found`);
    }
    return document;
  }

  async create(createDto: CreateDTO): Promise<T> {
    const createdDocument = new this.model(createDto);
    return createdDocument.save();
  }

  async update(id: string, updateDto: UpdateDTO): Promise<T> {
    const document = await this.model
      .findByIdAndUpdate(id, { ...updateDto } as UpdateQuery<T>, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!document) {
      throw new Error(`Document with id ${id} not found`);
    }

    return document;
  }

  async delete(id: string): Promise<{ message: string }> {
    const document = await this.model.findByIdAndDelete(id).exec();

    if (!document) {
      throw new Error(`Document with id ${id} not found`);
    }

    return {
      message: `Document with id ${id} was successfully deleted`,
    };
  }

  protected async findOneByQuery(query: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(query).exec();
  }
}
