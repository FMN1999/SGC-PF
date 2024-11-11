import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {
  private apiUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  crearIngresos(ingresoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}ingreso/`, ingresoData);
  }
}

