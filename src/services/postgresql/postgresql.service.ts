import { Pool, PoolConfig } from 'pg';

export class PostgreSQLService {
  private pool: Pool;

  constructor(config: PoolConfig) {
    this.pool = new Pool(config);
  }

  async checkConnection() {
    try {
      await this.pool.query('SELECT NOW()');
    } catch (error) {
      throw error;
    }
  }

  async queryRows(str: string) {
    try {
      const result = await this.pool.query(str);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async queryCount(str: string) {
    try {
      const result = await this.pool.query(str);
      return result.rows[0].count;
    } catch (error) {
      throw error;
    }
  }
}
