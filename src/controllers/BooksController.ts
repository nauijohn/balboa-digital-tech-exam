import { Request, Response } from 'express';

import { RequestWithUser, UserJwtToken } from '../interfaces/RequestWithUser';
import { Auth } from '../middlewares/Auth';
import { BooksRepository } from '../repositories/BooksRepository';
import {
  bodyValidator,
  controller,
  del,
  get,
  post,
  put,
  use,
} from './decorators';

@controller('/books')
class BooksController {
  @post('/')
  @bodyValidator('title', 'author', 'description', 'coverImage', 'price')
  @use(Auth.authorization)
  async addBook(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { title, author, description, coverImage, price } = req.body;
      const { id: userId } = req.user as UserJwtToken;
      await BooksRepository.addBook(
        userId,
        title,
        author,
        description,
        coverImage,
        price
      );
      res.status(201).send('Book created!');
      return;
    } catch (ex: any) {
      res.status(500).send(ex.message);
      return;
    }
  }

  @get('/')
  @use(Auth.authorization)
  async getBooks(req: RequestWithUser, res: Response): Promise<void> {
    try {
      // const { id: userId } = req.user as UserJwtToken;
      const userId = req.user ? req.user.id : null;
      const books = await BooksRepository.fetchAll(userId);
      res.status(200).send(books);
      return;
    } catch (ex: any) {
      res.status(500).send(ex.message);
      return;
    }
  }

  @get('/:id')
  @use(Auth.authorization)
  async getBookById(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user.id : null;
      const book = await BooksRepository.fetchBookById(parseInt(id), userId);
      res.status(200).send(book);
      return;
    } catch (ex: any) {
      res.status(ex.statusCode).send(ex.message);
      return;
    }
  }

  @put('/:id')
  @use(Auth.authorization)
  async updateBookById(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, author, description, coverImage, price } = req.body;
      const { id: userId } = req.user as UserJwtToken;
      const book = await BooksRepository.fetchBookById(parseInt(id), userId);
      if (book) {
        await BooksRepository.updateBook(
          parseInt(id),
          title,
          author,
          description,
          coverImage,
          price
        );
        res.status(200).send('Update successful!');
        return;
      }
      res.status(404).send('Book not found');
      return;
    } catch (ex: any) {
      res.status(ex.statusCode).send(ex.message);
      return;
    }
  }

  @del('/:id')
  @use(Auth.authorization)
  async deleteBook(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;
      const { id: userId } = req.user as UserJwtToken;
      const book = await BooksRepository.fetchBookById(parseInt(id), userId);
      if (book) {
        const result = await BooksRepository.deleteBookById(parseInt(id));
        if (result === 1) {
          res.send('Successfully deleted!');
          return;
        }
        throw new Error('Something went wrong');
      }
      res.status(404).send('Book not found');
      return;
    } catch (ex: any) {
      if (ex.statusCode) res.status(ex.statusCode).send(ex.message);
      else res.status(500).send(ex.message);
      return;
    }
  }
}
