import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { BaseDocument, Repository } from '../repositories/base.repository';

export abstract class BaseService<
  T extends BaseDocument,
  CreateDTO,
  UpdateDTO,
  R extends Repository<T, CreateDTO, UpdateDTO>,
> {
  constructor(protected readonly repository: R) {}

  findAll(paginationQuery: PaginationQueryDto) {
    return this.repository.findAll(paginationQuery);
  }

  findOne(id: string) {
    return this.repository.findOne(id);
  }

  create(createDto: CreateDTO) {
    return this.repository.create(createDto);
  }

  update(id: string, updateDto: UpdateDTO) {
    return this.repository.update(id, updateDto);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}
