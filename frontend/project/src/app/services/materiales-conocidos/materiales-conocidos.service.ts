import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialesConocidosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLista(idEmpresa: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/materiales-conocidos/empresa/${idEmpresa}/`);
  }
}
