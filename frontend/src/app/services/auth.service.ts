import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(username: string, password: string) {
    // Implementa la lógica de autenticación con tu backend
    // Retorna un observable con la respuesta del servidor
  }

  register(user: any) {
    // Implementa la lógica de registro
  }

  recoverPassword(email: string) {
    // Implementa la lógica de recuperación de contraseña
  }
}
