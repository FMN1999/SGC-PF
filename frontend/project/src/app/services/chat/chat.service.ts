import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {}

  // Esta función se comunica con el backend para obtener la respuesta del asistente
  getResponse(userMessage: string, adicional: any, modo: string): Observable<any> {
    const url = `${environment.apiUrl}/assistant?modo=${modo}`;
    const data = {
      message: userMessage,
      adicional: adicional, // Datos adicionales
    };
    return this.http.post<any>(url, data);
  }

  getMensajeBienvenida(modo: string): Observable<any> {
    const url = `${environment.apiUrl}/assistant?modo=${modo}`
    return this.http.get(url);
  }
}
