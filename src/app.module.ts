import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        MONGODB_PORT: Joi.number().port().default(27017),
        MONGODB_DATABASE: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    CoffeesModule,
    MongooseModule.forRoot(process.env.MONGODB_URI ?? ''),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
