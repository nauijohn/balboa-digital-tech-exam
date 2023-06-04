import { where } from 'sequelize';
import { Repository } from 'sequelize-typescript';

import Book from '../models/Book';
import { SequelizeConnection } from '../SequelizeConnection';

const repositories = SequelizeConnection.connectToDb().getRepository(Book);

export class BooksRepository {
  static async addBook(
    userId: number,
    title: string,
    author: string,
    description: string,
    coverImage: string,
    price: number
  ): Promise<void> {
    console.log('args: ', arguments);
    await repositories.create({
      userId,
      title,
      author,
      description,
      coverImage,
      price,
    });
  }

  static async fetchAll(userId?: number | null): Promise<Book[]> {
    if (userId) return await repositories.findAll({ where: { userId } });
    return await repositories.findAll();
  }

  static async fetchBookById(
    id: number,
    userId?: number | null
  ): Promise<Book> {
    const book = await repositories.findByPk(id);
    if (book) {
      if (userId) {
        if (userId !== book.userId)
          throw { statusCode: 404, message: 'Not Found' };
        return book;
      }
      return book;
    }
    throw { statusCode: 404, message: 'Not Found' };
  }

  static async updateBook(
    id: number,
    title: string,
    author: string,
    description: string,
    coverImage: string,
    price: string
  ) {
    return await repositories.update(
      { title, author, description, coverImage, price },
      { where: { id } }
    );
  }

  static async deleteBookById(id: number) {
    return await repositories.destroy({ where: { id } });
  }
}
