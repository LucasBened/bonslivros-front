import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ApiService, UserRegisterPayload } from '../../../services/api.service'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  userData: UserRegisterPayload = {
    nome: '',
    email: '',
    senha: '',
    cpf: '',
  };
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  isLoading: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  register(): void {
    if (
      !this.userData.nome ||
      !this.userData.email ||
      !this.userData.senha ||
      !this.userData.cpf
    ) {
      this.message = 'Por favor, preencha todos os campos.';
      this.messageType = 'error';
      return;
    }
    if (!/^\d{11}$/.test(this.userData.cpf)) {
      this.message = 'CPF inválido. Deve conter 11 dígitos numéricos.';
      this.messageType = 'error';
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.apiService.register(this.userData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Cadastro realizado:', response);
        this.message =
          response?.message ||
          'Cadastro realizado com sucesso! Redirecionando para login...';
        this.messageType = 'success';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.message =
          err.message ||
          'Falha ao realizar o cadastro. Verifique os dados ou tente novamente.';
        this.messageType = 'error';
        console.error('Erro no cadastro (componente):', err);
      },
    });
  }
}
