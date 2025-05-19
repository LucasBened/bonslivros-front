import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.components';
import { RegisterComponent } from './components/pages/register/register.component';
import { BookListComponent } from './components/pages/listarLivros/listarLivros.component';

export const routes: Routes = [
  // Redireciona a rota raiz (vazia) para '/login'
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Rota para a página de login
  { path: 'login', component: LoginComponent },

  // Rota para a página de cadastro (usando 'cadastro' como no seu exemplo)
  { path: 'cadastro', component: RegisterComponent },

  // Rota para a listagem de livros (o destino após o login bem-sucedido)
  { path: 'livros', component: BookListComponent }, // <-- ROTA ADICIONADA/CORRIGIDA

  // Opcional: Uma rota curinga para páginas não encontradas
  // { path: '**', component: PageNotFoundComponent } // Descomente e crie este componente se desejar
];
