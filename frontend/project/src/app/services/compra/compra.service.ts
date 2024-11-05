import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private apiUrl = 'http://localhost:8000/api/'; // URL del endpoint en el backend

  constructor(private http: HttpClient) {}
  crearCompra(compraData: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}solicitud-compra/`, compraData);
    }
}
