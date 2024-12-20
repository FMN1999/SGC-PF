import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PagoService {
    private baseUrl = 'http://localhost:8000/api/';  // URL base del backend
    private datosPago: any = null;

  constructor(private http: HttpClient) {}

  registrarPago(pago: any): Observable<any> {
    return this.http.post(`${this.baseUrl}pago/`, pago);
  }

  setDatosPago(datos: any): void {
    this.datosPago = datos;
  }

  getDatosPago(): any {
    return this.datosPago;
  }

  registrarCobro(pagoData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}registrar-pago/`, pagoData);
  }

  getComprasPendientes(idEmpresa: number) {
    return this.http.post<{ compras: any[] }>(`${this.baseUrl}compras-pendientes/`, { id_empresa: idEmpresa });
  }

  getSubcontrataciones(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}subcontrataciones/${idEmpresa}/`);
  }
}
