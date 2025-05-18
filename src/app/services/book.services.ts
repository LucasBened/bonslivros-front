import { Injectable } from '@angular/core';

export interface Book {
  titulo: string;
  autor: string;
  ano: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private localStorageKey = 'livros';

  constructor() {}

  getBooks(): Book[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }

  addBook(book: Book): void {
    const books = this.getBooks();
    books.push(book);
    localStorage.setItem(this.localStorageKey, JSON.stringify(books));
  }

  deleteBook(index: number): void {
    const books = this.getBooks();
    books.splice(index, 1);
    localStorage.setItem(this.localStorageKey, JSON.stringify(books));
  }
}
