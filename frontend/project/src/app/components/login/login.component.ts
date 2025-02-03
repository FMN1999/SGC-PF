import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service'; // Ajusta la ruta si es necesario
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    NgIf
  ],
  standalone: true,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoggedIn: boolean =false;

  constructor(private authService: AuthService, private router: Router, private titleService: Title) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        // Redirigir al usuario después del login exitoso
        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
      }
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Iniciar Sesión');
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.router.navigate(['/home']);
      }
    });
  }
}


