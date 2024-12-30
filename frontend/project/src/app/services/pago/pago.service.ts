import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
    private apiUrl = environment.apiUrl;
    private datosPago: any = null;

  constructor(private http: HttpClient) {}

  registrarPago(pago: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pago/`, pago);
  }

  setDatosPago(datos: any): void {
    this.datosPago = datos;
  }

  getDatosPago(): any {
    return this.datosPago;
  }

  registrarCobro(pagoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar-pago/`, pagoData);
  }

  getComprasPendientes(idEmpresa: number) {
    return this.http.post<{ compras: any[] }>(`${this.apiUrl}/compras-pendientes/`, { id_empresa: idEmpresa });
  }

  getSubcontrataciones(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/subcontrataciones/${idEmpresa}/`);
  }
}
