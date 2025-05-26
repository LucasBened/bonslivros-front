import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  ApiService,
  UserLoginPayload,
  LoginResponse, 
} from '../../../services/api.service'; 

@Component({
  selector: 'app-login', 
  standalone: true, 
  imports: [
    FormsModule, 
    CommonModule, 
    RouterLink, 
  ],
  templateUrl: './login.components.html',
  styleUrls: ['./login.components.css'], 
})
export class LoginComponent {
  credentials: UserLoginPayload = {
    email: '',
    senha: '',
  };
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private apiService: ApiService, 
    private router: Router
  ) {}

  login(): void {
    if (!this.credentials.email || !this.credentials.senha) {
      this.errorMessage = 'Por favor, preencha seu email e senha.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = ''; 

    this.apiService.login(this.credentials).subscribe({
      next: (response: LoginResponse) => {
        this.isLoading = false;
        console.log('Login bem-sucedido:', response);
        this.router.navigate(['/livros']); 
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.message ||
          'Falha no login. Verifique suas credenciais ou tente novamente mais tarde.';
        console.error('Erro no login (componente):', err);
      },
    });
  }
}
