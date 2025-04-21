import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  readonly brand: string;

  @IsString({ each: true })
  @IsOptional()
  readonly flavors: string[];
}
