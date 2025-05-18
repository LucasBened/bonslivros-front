import { Injectable } from '@angular/core';

interface User {
  name: string;
  email: string;
  password: string;
  cpf: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private localStorageKey = 'usuarios';

  constructor() {}

  register(email: string, password: string, user: User): void {
    const users = this.getAllUsers();

    // Evita duplicação de email
    if (users.some(u => u.email === email)) {
      console.error('Email já cadastrado!');
      return;
    }

    users.push(user);
    localStorage.setItem(this.localStorageKey, JSON.stringify(users));
  }

  login(email: string, password: string): boolean {
    const users = this.getAllUsers();
    return users.some(user => user.email === email && user.password === password);
  }

  getAllUsers(): User[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }
}
