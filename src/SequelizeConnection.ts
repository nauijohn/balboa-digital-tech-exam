import { Sequelize } from 'sequelize-typescript';

export class SequelizeConnection {
  private static instance: Sequelize;

  static connectToDb(): Sequelize {
    if (!SequelizeConnection.instance)
      SequelizeConnection.instance = new Sequelize({
        database: 'balboa-digital',
        dialect: 'mysql',
        username: 'root',
        password: 'lit59ogd7zie',
        storage: ':memory:',
        models: [__dirname + '/models'], // or [Player, Team],
        repositoryMode: true,
      });
    return SequelizeConnection.instance;
  }
}
