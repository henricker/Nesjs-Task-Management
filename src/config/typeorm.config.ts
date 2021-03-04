import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  name: 'default',
  type: 'postgres',
  url: process.env.ACCESS_DATABASE,
  synchronize: true,
  logging: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
