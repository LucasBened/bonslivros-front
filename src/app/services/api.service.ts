// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// --- Interfaces ---
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
  // O backend retorna o objeto Autor completo no login
  message?: string;
  id?: number; // ID do Autor
  nome?: string;
  email?: string;
  // Adicione outros campos do Autor que o backend possa retornar, se útil
}

export interface AuthorPayload {
  // Usado para enviar apenas o ID do autor
  id: number;
}

export interface BookRegisterPayload {
  titulo: string;
  autor: AuthorPayload; // Continuará a enviar { "id": authorId }
  genero: string;
  editora: string;
  dataPublicacao: string;
}

export interface BookResponse {
  id: number;
  titulo: string;
  autor: { id: number; nome?: string };
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
  private loggedInAuthorId: number | null = null; // Para armazenar o ID do autor logado

  constructor(private http: HttpClient) {}

  // --- Métodos de Autenticação e Usuário ---
  register(userData: UserRegisterPayload): Observable<any> {
    const url = `${this.baseUrl}/autor`;
    console.log('ApiService: Tentando registar utilizador:', userData);
    return this.http.post<any>(url, userData).pipe(
      tap((response) =>
        console.log('ApiService: Resposta do registo:', response)
      ),
      catchError(this.handleError)
    );
  }

  login(credentials: UserLoginPayload): Observable<LoginResponse> {
    const url = `${this.baseUrl}/login`;
    console.log('ApiService: Tentando login com credenciais:', credentials);
    return this.http.post<LoginResponse>(url, credentials).pipe(
      tap((response) => {
        console.log('ApiService: Resposta da API de Login:', response);
        if (response && response.id) {
          // Verifica se o ID do autor foi retornado
          this.userIsCurrentlyLoggedIn = true;
          this.loggedInAuthorId = response.id; // Armazena o ID do autor
          console.log(
            'ApiService: Utilizador marcado como LOGADO. ID do Autor:',
            this.loggedInAuthorId
          );
        } else {
          // Se o backend não retornar o ID ou a estrutura esperada, o login falha do ponto de vista do frontend
          this.userIsCurrentlyLoggedIn = false;
          this.loggedInAuthorId = null;
          console.warn(
            'ApiService: Login bem-sucedido no backend, mas ID do autor não encontrado na resposta. Login no frontend considerado falho.'
          );
          // Poderia até mesmo lançar um erro aqui para o componente de login tratar
          // throw new Error('Resposta de login inválida: ID do autor ausente.');
        }
      }),
      catchError((error) => {
        this.userIsCurrentlyLoggedIn = false;
        this.loggedInAuthorId = null;
        console.warn('ApiService: Erro no login, utilizador NÃO está logado.');
        return this.handleError(error);
      })
    );
  }

  logout(): void {
    console.log('ApiService: Efetuando logout.');
    this.userIsCurrentlyLoggedIn = false;
    this.loggedInAuthorId = null; // Limpa o ID do autor ao sair
  }

  isLoggedIn(): boolean {
    console.log(
      'ApiService: Verificando estado de login:',
      this.userIsCurrentlyLoggedIn
    );
    return this.userIsCurrentlyLoggedIn;
  }

  getLoggedInAuthorId(): number | null {
    console.log(
      'ApiService: getLoggedInAuthorId() chamado, ID retornado:',
      this.loggedInAuthorId
    );
    return this.loggedInAuthorId;
  }

  private getRequestHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // --- Métodos de Livros ---
  getBooks(): Observable<BookResponse[]> {
    const url = `${this.baseUrl}`;
    return this.http.get<BookResponse[]>(url).pipe(
      tap((response) =>
        console.log('ApiService: Resposta de getBooks:', response)
      ),
      catchError(this.handleError)
    );
  }

  addBook(bookData: BookRegisterPayload): Observable<BookResponse> {
    const url = `${this.baseUrl}`;
    console.log('ApiService: A adicionar livro:', bookData); // O bookData já deve vir com o autor.id correto
    return this.http
      .post<BookResponse>(url, bookData, { headers: this.getRequestHeaders() })
      .pipe(
        tap((response) =>
          console.log('ApiService: Resposta de addBook:', response)
        ),
        catchError(this.handleError)
      );
  }

  updateBook(bookId: number, bookData: BookResponse): Observable<BookResponse> {
    const url = `${this.baseUrl}/${bookId}`;
    console.log(
      'ApiService: A atualizar livro com ID:',
      bookId,
      'Dados:',
      bookData
    ); // bookData já deve ter autor.id
    return this.http
      .put<BookResponse>(url, bookData, { headers: this.getRequestHeaders() })
      .pipe(
        tap((response) =>
          console.log('ApiService: Resposta de updateBook:', response)
        ),
        catchError(this.handleError)
      );
  }

  deleteBook(bookId: number): Observable<any> {
    const url = `${this.baseUrl}/${bookId}`;
    console.log(
      'ApiService: A deletar livro com ID:',
      bookId,
      'para URL:',
      url
    );
    return this.http
      .delete<any>(url, { headers: this.getRequestHeaders() })
      .pipe(
        tap((response) =>
          console.log('ApiService: Resposta de deleteBook:', response)
        ),
        catchError(this.handleError)
      );
  }

  // --- Tratamento de Erros ---
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    console.error('ApiService: Erro HTTP Detetado:', error);
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
    console.error('ApiService: Mensagem de erro tratada:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
