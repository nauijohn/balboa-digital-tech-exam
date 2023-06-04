import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import User from './User';

@Table
class Book extends Model {
  @Column
  title: string;

  @Column
  author: string;

  @Column
  description: string;

  @Column
  coverImage: string;

  @Column
  price: number;

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  user: User;
}

export default Book;
