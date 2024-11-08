import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private apiUrl = 'http://localhost:8000/api/'; // Cambia según la ruta del backend

  constructor(private http: HttpClient) {}

  crearTarea(tarea: any): Observable<any> {
    return this.http.post(`${this.apiUrl}tarea/`, tarea);
  }
}
