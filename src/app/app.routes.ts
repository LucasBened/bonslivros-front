import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.components';
import { RegisterComponent } from './components/pages/register/register.component';
import { BookListComponent } from './components/pages/listarLivros/listarLivros.component';
export const routes: Routes = [
  {
    path: '',
    component: BookListComponent
  },
  {
    path: 'cadastro',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
];
