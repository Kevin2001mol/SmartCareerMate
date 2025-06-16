// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // false = modo Registro, true = modo Login
  isLoginMode = false;

  // campos del formulario
  name = '';
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    // limpiar campos al cambiar de modo
    this.name = '';
    this.email = '';
    this.password = '';
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    if (this.isLoginMode) {
      this.auth.login({ email: this.email, password: this.password });
    } else {
      this.auth.register({ name: this.name, email: this.email, password: this.password });
    }

    this.router.navigate(['/home']);
  }
}
