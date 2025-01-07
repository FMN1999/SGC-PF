import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubcontratacionService {
   private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  crearSubcontratacion(nuevaSubcontratacion: any) {
    return this.http.post(`${this.apiUrl}/subcontrataciones/`, nuevaSubcontratacion);
  }
}
