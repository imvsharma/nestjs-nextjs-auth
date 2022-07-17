import { registerAs } from '@nestjs/config';
export default registerAs('databaseconfig', () => ({
  dbConnectionString: process.env.DATABASE_URL,
}));
