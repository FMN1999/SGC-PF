import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = 'http://localhost:8000/api/'; // Ruta del backend

  constructor(private http: HttpClient) {}

  getReporteObra(obraId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}reporte-gastos-avance/${obraId}/`);
  }
}

