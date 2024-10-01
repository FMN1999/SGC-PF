import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service'; // Ajusta la ruta si es necesario
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response:any) => {
        // Almacena el token o lo que sea necesario para saber que el usuario está autenticado
        localStorage.setItem('token', response.token);
        // Redirigir al usuario después del login exitoso
        this.router.navigate(['/home']); // Ajusta la ruta según tu aplicación
      },
      error: (error:any) => {
        this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
        console.error('Error de login:', error);
      }
    });
  }
}


