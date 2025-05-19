// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// --- Interfaces (mantidas como antes) ---
export interface UserRegisterPayload {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
}

export interface UserLoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  message?: string;
  id?: number;
  nome?: string;
  email?: string;
}

export interface AuthorPayload {
  id: number;
}

// Usado para criar um novo livro
export interface BookRegisterPayload {
  titulo: string;
  autor: AuthorPayload; // Apenas o ID do autor
  genero: string;
  editora: string;
  dataPublicacao: string;
}

// Representa um livro como recebido do backend (com ID do livro e detalhes do autor)
// Também será usado como payload para atualização, pois o backend espera o objeto Livro completo.
export interface BookResponse {
  id: number;
  titulo: string;
  autor: { id: number; nome?: string }; // Backend pode retornar nome, para update enviamos só ID em autor
  genero: string;
  editora: string;
  dataPublicacao: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/livraria';
  private userIsCurrentlyLoggedIn: boolean = false;

  constructor(private http: HttpClient) {}

  // --- Métodos de Autenticação e Usuário (sem alterações) ---
  register(userData: UserRegisterPayload): Observable<any> {
    const url = `${this.baseUrl}/autor/registro`;
    console.log(
      'ApiService (NoToken): Tentando registar utilizador:',
      userData
    );
    return this.http.post<any>(url, userData).pipe(
      tap((response) =>
        console.log('ApiService (NoToken): Resposta do registo:', response)
      ),
      catchError(this.handleError)
    );
  }

  login(credentials: UserLoginPayload): Observable<LoginResponse> {
    const url = `${this.baseUrl}/login`;
    console.log(
      'ApiService (NoToken): Tentando login com credenciais:',
      credentials
    );
    return this.http.post<LoginResponse>(url, credentials).pipe(
      tap((response) => {
        console.log(
          'ApiService (NoToken): Resposta da API de Login:',
          response
        );
        this.userIsCurrentlyLoggedIn = true;
        console.log('ApiService (NoToken): Utilizador marcado como LOGADO.');
      }),
      catchError((error) => {
        this.userIsCurrentlyLoggedIn = false;
        console.warn(
          'ApiService (NoToken): Erro no login, utilizador NÃO está logado.'
        );
        return this.handleError(error);
      })
    );
  }

  logout(): void {
    console.log('ApiService (NoToken): Efetuando logout.');
    this.userIsCurrentlyLoggedIn = false;
  }

  isLoggedIn(): boolean {
    console.log(
      'ApiService (NoToken): Verificando estado de login:',
      this.userIsCurrentlyLoggedIn
    );
    return this.userIsCurrentlyLoggedIn;
  }

  private getRequestHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // --- Métodos de Livros ---
  getBooks(): Observable<BookResponse[]> {
    const url = `${this.baseUrl}`;
    console.log('ApiService (NoToken): A obter livros de:', url);
    return this.http.get<BookResponse[]>(url).pipe(
      tap((response) =>
        console.log('ApiService (NoToken): Resposta de getBooks:', response)
      ),
      catchError(this.handleError)
    );
  }

  addBook(bookData: BookRegisterPayload): Observable<BookResponse> {
    const url = `${this.baseUrl}`;
    console.log('ApiService (NoToken): A adicionar livro:', bookData);
    return this.http
      .post<BookResponse>(url, bookData, { headers: this.getRequestHeaders() })
      .pipe(
        tap((response) =>
          console.log('ApiService (NoToken): Resposta de addBook:', response)
        ),
        catchError(this.handleError)
      );
  }

  // NOVO MÉTODO PARA ATUALIZAR LIVRO
  updateBook(bookId: number, bookData: BookResponse): Observable<BookResponse> {
    const url = `${this.baseUrl}/${bookId}`; // PUT para /livraria/{id}
    console.log(
      'ApiService (NoToken): A atualizar livro com ID:',
      bookId,
      'Dados:',
      bookData,
      'URL:',
      url
    );
    // O backend espera o objeto Livro completo no corpo, incluindo o ID.
    // O bookData já deve conter o ID do livro.
    return this.http
      .put<BookResponse>(url, bookData, { headers: this.getRequestHeaders() })
      .pipe(
        tap((response) =>
          console.log('ApiService (NoToken): Resposta de updateBook:', response)
        ),
        catchError(this.handleError)
      );
  }

  deleteBook(bookId: number): Observable<any> {
    const url = `${this.baseUrl}/${bookId}`;
    console.log(
      'ApiService (NoToken): A deletar livro com ID:',
      bookId,
      'para URL:',
      url
    );
    return this.http
      .delete<any>(url, { headers: this.getRequestHeaders() })
      .pipe(
        tap((response) =>
          console.log('ApiService (NoToken): Resposta de deleteBook:', response)
        ),
        catchError(this.handleError)
      );
  }

  // --- Tratamento de Erros (sem alterações) ---
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    console.error('ApiService (NoToken): Erro HTTP Detetado:', error);
    if (error.status === 0 || error.error instanceof ProgressEvent) {
      errorMessage =
        'Não foi possível conectar ao servidor. Verifique sua rede ou se o backend está rodando.';
    } else if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.error) {
        errorMessage = error.error.error;
      } else if (Object.keys(error.error).length > 0) {
        const firstKey = Object.keys(error.error)[0];
        errorMessage = `${firstKey}: ${error.error[firstKey]}`;
      } else {
        errorMessage = `Erro ${error.status}: ${
          error.statusText || 'Erro no servidor'
        }`;
      }
    } else {
      errorMessage = `Erro ${error.status}: ${
        error.statusText || 'Erro no servidor'
      }`;
    }
    console.error(
      'ApiService (NoToken): Mensagem de erro tratada:',
      errorMessage
    );
    return throwError(() => new Error(errorMessage));
  }
}
