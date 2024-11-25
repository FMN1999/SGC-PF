import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Nota {
  id: number;
  descripcion: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})

export class ObraService {

  private baseUrl = 'http://localhost:8000/api/';  // URL base del backend


  constructor(private http: HttpClient) {}

  crearObra(obraData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}crear-obra/`, obraData);
  }

  obtenerObra(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}obra/${id}/`);
  }

  actualizarObra(id_obra: number, obraData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}obra/${id_obra}/actualizar/`, obraData);
  }

  crearArea(areaData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}areas/crear/`, areaData);
  }

  obtenerAreasPorObra(obraId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}areas/obra/${obraId}/`);
  }

  eliminarArea(areaId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}areas/eliminar/${areaId}/`);
  }

  agregarNota(id_usuario: number, descripcion: string | null | undefined, id_obra: number): Observable <Nota> {
    return this.http.post<Nota>(`${this.baseUrl}nota/`, { id_usuario, descripcion, id_obra });
  }

  agregarFoto(idNota: number, url: string) {
    return this.http.post(`${this.baseUrl}nota/${idNota}/foto/`, { url });
  }

  obtenerNotasPorObra(id_obra: number) {
    return this.http.get<any[]>(`${this.baseUrl}notas/${id_obra}/`);
  }

  eliminarNota(notaId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}notas/eliminar/${notaId}/`);
  }

  agregarDocumento(documento: any): Observable<any> {
    return this.http.post(`${this.baseUrl}documentos/agregar/`, documento);
  }

  obtenerDocumentosPorObra(id_obra: number): Observable<any> {
    return this.http.get(`${this.baseUrl}documentos/obra/${id_obra}/`);
  }

  eliminarDocumento(id_documento: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}documentos/${id_documento}/eliminar/`);
  }

  getPresupuestosPorObra(idObra: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}obras/${idObra}/presupuestos/`);
  }

  obtenerPagosCobrosPorObra(id_obra: number): Observable<any> {
    return this.http.get(`${this.baseUrl}pagos-cobros-obra/${id_obra}/`);
  }
}

