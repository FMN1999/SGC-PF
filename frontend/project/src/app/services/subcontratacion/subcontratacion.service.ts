import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SubcontratacionService {
   private apiUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) { }

  crearSubcontratacion(nuevaSubcontratacion: any) {
    return this.http.post(`${this.apiUrl}subcontrataciones/`, nuevaSubcontratacion);
  }
}
