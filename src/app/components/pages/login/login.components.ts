import { Component } from '@angular/core';
import { Router , RouterLink} from '@angular/router';
import { UserService } from '../../../services/user.services';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.components.html',
  styleUrls: ['./login.components.css']
})
export class LoginComponent {
  constructor(private userService: UserService, private router: Router) {}

  login(email: string, password: string): void {
    const el = document.getElementById('error-message');
    if (this.userService.login(email, password)) {
      if (el) el.textContent = '';
      this.router.navigate(['/books']);
    } else {
      if (el) el.textContent = 'Email ou senha inválidos.';
    }
  }
}
