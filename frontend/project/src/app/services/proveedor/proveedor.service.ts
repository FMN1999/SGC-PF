import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  crearProveedor(proveedorData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-proveedor/`, proveedorData);
  }

  obtenerProveedor(proveedor_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/proveedor/${proveedor_id}/`);
  }
}
