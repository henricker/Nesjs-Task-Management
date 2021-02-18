import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  name: 'default',
  type: 'postgres',
  url: 'your_url_database_here',
  synchronize: true,
  logging: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
