import { Component, OnInit } from '@angular/core';
import { BookService, Book } from '../../../services/book.services';
import {MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-book-list',
  imports: [MatTableModule, CommonModule, RouterLink],
  templateUrl: './listarLivros.component.html',
  styleUrls: ['./listarLivros.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  displayedColumns: string[] = ['titulo', 'autor', 'ano', 'acoes'];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.books = this.bookService.getBooks();
  }

  addBook(titulo: string, autor: string, anoStr: string): void {
    const ano = parseInt(anoStr, 10);
    if (titulo && autor && ano) {
      this.bookService.addBook({ titulo, autor, ano });
      this.loadBooks();
    }
  }

  deleteBook(index: number): void {
    this.bookService.deleteBook(index);
    this.loadBooks();
  }
}
