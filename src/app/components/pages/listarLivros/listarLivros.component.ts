import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import {
  ApiService,
  BookRegisterPayload,
  BookResponse,
} from '../../../services/api.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './listarLivros.component.html',
  styleUrls: ['./listarLivros.component.css'],
})
export class BookListComponent implements OnInit {
  books: BookResponse[] = [];
  displayedColumns: string[] = [
    'titulo',
    'autorDetalhes',
    'genero',
    'editora',
    'dataPublicacao',
    'acoes',
  ];

  newBookData: Omit<BookRegisterPayload, 'autor'> & {
    autor?: { id: number | null };
  } = {
    titulo: '',
    genero: '',
    editora: '',
    dataPublicacao: '',
  };

  isEditing: boolean = false;
  currentEditingBook: BookResponse | null = null;
  editBookFormModel: {
    id: number;
    titulo: string;
    genero: string;
    editora: string;
    dataPublicacao: string;
  } = {
    id: 0,
    titulo: '',
    genero: '',
    editora: '',
    dataPublicacao: '',
  };

  message: string = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  isLoading: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    console.log('BookListComponent: ngOnInit() chamado.');
    if (!this.apiService.isLoggedIn()) {
      this.message = 'Você precisa estar logado para ver os livros.';
      this.messageType = 'error';
      setTimeout(() => this.router.navigate(['/login']), 100);
      return;
    }
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.message = '';
    this.apiService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        if (this.books.length === 0) {
          this.message = 'Nenhum livro cadastrado no momento.';
          this.messageType = 'info';
        }
        this.isLoading = false;
      },
      error: (err) => this.handleApiError(err, 'Falha ao carregar os livros.'),
    });
  }

  // --- Lógica para Adicionar Livro ---
  handleAddBook(): void {
    const loggedInAuthorId = this.apiService.getLoggedInAuthorId();
    if (loggedInAuthorId === null) {
      this.message =
        'Não foi possível identificar o autor logado. Faça login novamente.';
      this.messageType = 'error';
      return;
    }

    if (
      !this.newBookData.titulo ||
      !this.newBookData.genero ||
      !this.newBookData.editora ||
      !this.newBookData.dataPublicacao
    ) {
      this.message =
        'Por favor, preencha todos os campos obrigatórios do livro.';
      this.messageType = 'error';
      return;
    }
    if (!/^\d{2}-\d{2}-\d{4}$/.test(this.newBookData.dataPublicacao)) {
      this.message = 'Formato da data de publicação inválido. Use DD-MM-YYYY.';
      this.messageType = 'error';
      return;
    }

    this.isLoading = true;
    this.message = '';

    const payload: BookRegisterPayload = {
      titulo: this.newBookData.titulo,
      autor: { id: loggedInAuthorId }, 
      genero: this.newBookData.genero,
      editora: this.newBookData.editora,
      dataPublicacao: this.newBookData.dataPublicacao,
    };

    this.apiService.addBook(payload).subscribe({
      next: () => {
        this.message = 'Livro adicionado com sucesso!';
        this.messageType = 'success';
        this.loadBooks();
        this.newBookData = {
          titulo: '',
          genero: '',
          editora: '',
          dataPublicacao: '',
        }; 
        this.isLoading = false;
      },
      error: (err) => this.handleApiError(err, 'Falha ao adicionar o livro.'),
    });
  }

  // --- Lógica para Editar Livro ---
  startEditBook(book: BookResponse): void {
    this.isEditing = true;
    this.currentEditingBook = { ...book }; 

    this.editBookFormModel = {
      id: book.id,
      titulo: book.titulo,
      genero: book.genero,
      editora: book.editora,
      dataPublicacao: book.dataPublicacao,
    };
    this.message = '';
    console.log('Iniciando edição para:', book);
  }

  handleUpdateBook(): void {
    const loggedInAuthorId = this.apiService.getLoggedInAuthorId();
    if (loggedInAuthorId === null) {
      this.message =
        'Não foi possível identificar o autor logado para atualizar. Faça login novamente.';
      this.messageType = 'error';
      return;
    }

    if (
      !this.currentEditingBook ||
      !this.editBookFormModel.titulo ||
      !this.editBookFormModel.genero ||
      !this.editBookFormModel.editora ||
      !this.editBookFormModel.dataPublicacao
    ) {
      this.message =
        'Erro ao tentar atualizar. Preencha todos os campos do livro.';
      this.messageType = 'error';
      return;
    }
    if (!/^\d{2}-\d{2}-\d{4}$/.test(this.editBookFormModel.dataPublicacao)) {
      this.message =
        'Formato da data de publicação inválido para edição. Use DD-MM-YYYY.';
      this.messageType = 'error';
      return;
    }

    this.isLoading = true;
    this.message = '';

    const updatePayload: BookResponse = {
      id: this.editBookFormModel.id,
      titulo: this.editBookFormModel.titulo,
      autor: { id: loggedInAuthorId, nome: this.currentEditingBook.autor.nome }, 
      genero: this.editBookFormModel.genero,
      editora: this.editBookFormModel.editora,
      dataPublicacao: this.editBookFormModel.dataPublicacao,
    };

    this.apiService
      .updateBook(this.currentEditingBook.id, updatePayload)
      .subscribe({
        next: () => {
          this.message = 'Livro atualizado com sucesso!';
          this.messageType = 'success';
          this.loadBooks();
          this.cancelEditBook();
          this.isLoading = false;
        },
        error: (err) => this.handleApiError(err, 'Falha ao atualizar o livro.'),
      });
  }

  cancelEditBook(): void {
    this.isEditing = false;
    this.currentEditingBook = null;
    this.editBookFormModel = {
      id: 0,
      titulo: '',
      genero: '',
      editora: '',
      dataPublicacao: '',
    };
    this.message = '';
  }

  // --- Lógica para Deletar Livro---
  handleDeleteBook(bookId: number): void {
    if (bookId === null || bookId === undefined || isNaN(bookId)) {
      this.message = 'ID do livro inválido para exclusão.';
      this.messageType = 'error';
      return;
    }
    if (!confirm('Tem certeza que deseja excluir este livro?')) {
      return;
    }
    this.isLoading = true;
    this.message = '';
    this.apiService.deleteBook(bookId).subscribe({
      next: () => {
        this.message = 'Livro deletado com sucesso!';
        this.messageType = 'success';
        this.loadBooks();
        this.isLoading = false;
      },
      error: (err) => this.handleApiError(err, 'Falha ao deletar o livro.'),
    });
  }

  logout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }

  private handleApiError(err: any, defaultMessage: string): void {
    this.message = err.message || defaultMessage;
    this.messageType = 'error';
    this.isLoading = false;
    if (err.status === 401 || err.status === 403) {
      this.apiService.logout();
      this.router.navigate(['/login']);
    }
  }
}
