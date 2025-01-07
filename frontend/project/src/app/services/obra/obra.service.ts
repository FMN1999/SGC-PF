import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Nota {
  id: number;
  descripcion: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})

export class ObraService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  crearObra(obraData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-obra/`, obraData);
  }

  obtenerObra(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obra/${id}/`);
  }

  actualizarObra(id_obra: number, obraData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/obra/${id_obra}/actualizar/`, obraData);
  }

  crearArea(areaData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/areas/crear/`, areaData);
  }

  obtenerAreasPorObra(obraId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/areas/obra/${obraId}/`);
  }

  eliminarArea(areaId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/areas/eliminar/${areaId}/`);
  }

  agregarNota(id_usuario: number, descripcion: string | null | undefined, id_obra: number): Observable <Nota> {
    return this.http.post<Nota>(`${this.apiUrl}/nota/`, { id_usuario, descripcion, id_obra });
  }

  agregarFoto(idNota: number, url: string) {
    return this.http.post(`${this.apiUrl}/nota/${idNota}/foto/`, { url });
  }

  obtenerNotasPorObra(id_obra: number) {
    return this.http.get<any[]>(`${this.apiUrl}/notas/${id_obra}/`);
  }

  eliminarNota(notaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notas/eliminar/${notaId}/`);
  }

  agregarDocumento(documento: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/documentos/agregar/`, documento);
  }

  obtenerDocumentosPorObra(id_obra: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/documentos/obra/${id_obra}/`);
  }

  eliminarDocumento(id_documento: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/documentos/${id_documento}/eliminar/`);
  }

  getPresupuestosPorObra(idObra: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/obras/${idObra}/presupuestos/`);
  }

  obtenerPagosCobrosPorObra(id_obra: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pagos-cobros-obra/${id_obra}/`);
  }
}

