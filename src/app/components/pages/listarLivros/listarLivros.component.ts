// src/app/components/listar-livros/listar-livros.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Para modal (opcional)

import {
  ApiService,
  BookRegisterPayload, // Usado para o formulário de adicionar
  BookResponse, // Usado para listar e para o formulário de editar
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
    MatDialogModule, // Para modal (opcional)
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

  // Para o formulário de adicionar novo livro
  newBookData: BookRegisterPayload = {
    titulo: '',
    autor: { id: 0 },
    genero: '',
    editora: '',
    dataPublicacao: '',
  };
  addAutorIdInput: number | null = null; // ID do autor para o formulário de adicionar

  // Para o formulário de edição
  isEditing: boolean = false;
  currentEditingBook: BookResponse | null = null; // Livro original que está a ser editado
  editBookFormModel: {
    // Modelo para o formulário de edição
    id: number;
    titulo: string;
    autorId: number | null; // Apenas o ID do autor para o input do formulário de edição
    genero: string;
    editora: string;
    dataPublicacao: string;
  } = {
    id: 0,
    titulo: '',
    autorId: null,
    genero: '',
    editora: '',
    dataPublicacao: '',
  };

  message: string = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  isLoading: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog // Para modal (opcional)
  ) {}

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
      error: (err) => {
        this.message = err.message || 'Falha ao carregar os livros.';
        this.messageType = 'error';
        this.isLoading = false;
        if (err.status === 401 || err.status === 403) {
          this.apiService.logout();
          this.router.navigate(['/login']);
        }
      },
    });
  }

  // --- Lógica para Adicionar Livro ---
  handleAddBook(): void {
    if (
      !this.newBookData.titulo ||
      this.addAutorIdInput === null ||
      this.addAutorIdInput <= 0 ||
      !this.newBookData.genero ||
      !this.newBookData.editora ||
      !this.newBookData.dataPublicacao
    ) {
      this.message =
        'Por favor, preencha todos os campos obrigatórios do livro, incluindo um ID de autor válido.';
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
      ...this.newBookData,
      autor: { id: this.addAutorIdInput },
    };

    this.apiService.addBook(payload).subscribe({
      next: () => {
        this.message = 'Livro adicionado com sucesso!';
        this.messageType = 'success';
        this.loadBooks();
        this.newBookData = {
          titulo: '',
          autor: { id: 0 },
          genero: '',
          editora: '',
          dataPublicacao: '',
        };
        this.addAutorIdInput = null;
        this.isLoading = false;
      },
      error: (err) => this.handleApiError(err, 'Falha ao adicionar o livro.'),
    });
  }

  // --- Lógica para Editar Livro ---
  startEditBook(book: BookResponse): void {
    this.isEditing = true;
    this.currentEditingBook = book; // Guarda a referência ao livro original
    // Preenche o modelo do formulário de edição com os dados do livro
    this.editBookFormModel = {
      id: book.id,
      titulo: book.titulo,
      autorId: book.autor.id, // Apenas o ID do autor para o input
      genero: book.genero,
      editora: book.editora,
      dataPublicacao: book.dataPublicacao,
    };
    this.message = ''; // Limpa mensagens anteriores
    // Se estiver a usar um modal, abriria o modal aqui.
    // Por simplicidade, vamos mostrar/esconder um formulário na página.
    console.log('Iniciando edição para:', book);
  }

  handleUpdateBook(): void {
    if (
      !this.currentEditingBook ||
      this.editBookFormModel.autorId === null ||
      this.editBookFormModel.autorId <= 0
    ) {
      this.message =
        'Erro ao tentar atualizar. Dados do livro ou ID do autor inválidos.';
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

    // Prepara o payload para a API. O backend espera o objeto Livro completo.
    const updatePayload: BookResponse = {
      id: this.editBookFormModel.id,
      titulo: this.editBookFormModel.titulo,
      autor: {
        id: this.editBookFormModel.autorId,
        nome: this.currentEditingBook.autor.nome,
      }, // Mantém o nome original do autor se existir, ou envia só o ID.
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
          this.cancelEditBook(); // Limpa o estado de edição
          this.isLoading = false;
        },
        error: (err) => this.handleApiError(err, 'Falha ao atualizar o livro.'),
      });
  }

  cancelEditBook(): void {
    this.isEditing = false;
    this.currentEditingBook = null;
    // Limpa o modelo do formulário de edição
    this.editBookFormModel = {
      id: 0,
      titulo: '',
      autorId: null,
      genero: '',
      editora: '',
      dataPublicacao: '',
    };
    this.message = '';
  }

  // --- Lógica para Deletar Livro ---
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

  // Helper para tratar erros da API
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
