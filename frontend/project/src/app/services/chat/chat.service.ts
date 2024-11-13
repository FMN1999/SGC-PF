import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8000/api/'; // Cambia según la ruta del backend
  constructor(private http: HttpClient) { }

  buscarMaterialServicio(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}chat-presupuesto`, { params: { query } });
  }
}
