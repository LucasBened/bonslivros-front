import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.services';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private userService: UserService, private router: Router) {}

  register(name: string, email: string, password: string, cpf: string): void {
    if (!name || !email || !password || !cpf) return;

    this.userService.register(email, password, { name, email, password, cpf });

    const el = document.getElementById('msg');
    if (el) el.textContent = 'Cadastro realizado com sucesso!';

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }
}
