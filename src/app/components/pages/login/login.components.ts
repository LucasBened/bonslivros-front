import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Necessário para [(ngModel)]
import { CommonModule } from '@angular/common'; // Necessário para *ngIf, etc.

// Importe ApiService, UserLoginPayload e a interface correta LoginResponse
import {
  ApiService,
  UserLoginPayload,
  LoginResponse, // Corrigido: Usar LoginResponse em vez de AuthResponse
} from '../../../services/api.service'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-login', // Certifique-se que o seletor corresponde ao usado no seu roteamento/template
  standalone: true, // Se este for um componente standalone
  imports: [
    FormsModule, // Para [(ngModel)] e #loginForm="ngForm"
    CommonModule, // Para diretivas como *ngIf
    RouterLink, // Para o link de 'Cadastre-se'
  ],
  templateUrl: './login.components.html', // Verifique se o nome do arquivo HTML está correto
  styleUrls: ['./login.components.css'], // Verifique se o nome do arquivo CSS está correto
})
export class LoginComponent {
  credentials: UserLoginPayload = {
    email: '',
    senha: '',
  };
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private apiService: ApiService, // Injeção do ApiService
    private router: Router
  ) {}

  login(): void {
    // Validação básica no lado do cliente
    if (!this.credentials.email || !this.credentials.senha) {
      this.errorMessage = 'Por favor, preencha seu email e senha.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = ''; // Limpa mensagens de erro anteriores

    this.apiService.login(this.credentials).subscribe({
      next: (response: LoginResponse) => {
        // Corrigido: Usar LoginResponse para tipar a resposta
        this.isLoading = false;
        console.log('Login bem-sucedido:', response);
        // Com a abordagem sem tokens, o ApiService.login() já define o estado de logado.
        // Apenas navegamos.
        this.router.navigate(['/livros']); // Ajuste a rota se o nome for 'books' ou outro
      },
      error: (err) => {
        this.isLoading = false;
        // A mensagem de erro já vem tratada do handleError no ApiService
        this.errorMessage =
          err.message ||
          'Falha no login. Verifique suas credenciais ou tente novamente mais tarde.';
        console.error('Erro no login (componente):', err);
      },
    });
  }
}
