import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {}

  // Esta función se comunica con el backend para obtener la respuesta del asistente
getResponse(userMessage: string, adicional: any): Observable<any> {
  const url = 'http://localhost:8000/api/assistant';  // URL del endpoint
  const data = {
    message: userMessage,
    adicional: adicional, // Datos adicionales
  };
  return this.http.post<any>(url, data);
}
}

