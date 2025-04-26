import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Coffee extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  brand: string;

  @Prop([String])
  flavors: string[];

  @Prop({ default: 0 })
  recommendations: number;
}

export const CoffeeSchema = SchemaFactory.createForClass(Coffee);
