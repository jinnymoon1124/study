import 'reflect-metadata';
import { DataSource } from 'typeorm';

// 연결 정보 설정 파일

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'postgres',
  synchronize: true,
  logging: false,
  // entities: [User],
  entities: [
    "src/entities/**/*.ts"
  ],

  migrations: [],
  subscribers: [],
});
