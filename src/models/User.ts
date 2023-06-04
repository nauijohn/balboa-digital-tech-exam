import { Column, HasMany, Model, Table } from 'sequelize-typescript';

import Book from './Book';

@Table
class User extends Model {
  @Column
  username: string;

  @Column
  password: string;

  @HasMany(() => Book)
  books: Book[];
}

export default User;
