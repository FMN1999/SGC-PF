import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObraService {

  private baseUrl = 'http://localhost:8000/api/';  // URL base del backend

  constructor(private http: HttpClient) {}

  crearObra(obraData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}crear-obra/`, obraData);
  }
}

