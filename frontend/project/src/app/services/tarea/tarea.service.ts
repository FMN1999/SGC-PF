import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private apiUrl = 'http://localhost:8000/api/'; // Cambia según la ruta del backend

  constructor(private http: HttpClient) {}

  crearTarea(tarea: any): Observable<any> {
    return this.http.post(`${this.apiUrl}tarea/`, tarea);
  }

  getTarea(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}tarea/${id}/`);
  }

  agregarColaborador(colaboradorData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}tarea/agregar-colaborador/`, colaboradorData);
  }

  agregarHerramienta(herramientaData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}tarea/agregar-herramienta/`, herramientaData);
  }
  agregarMaterial(materialData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}tarea/agregar-material/`, materialData);
  }

  actualizarTarea(idTarea: number, tareaData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}tarea/${idTarea}/actualizar/`, tareaData);
  }

  obtenerColaboradoresTarea(tareaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}tarea/${tareaId}/colaboradores/`);
  }

  obtenerHerramientasTarea(tareaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}tarea/${tareaId}/herramientas/`);
  }

  obtenerMaterialesTarea(tareaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}tarea/${tareaId}/materiales/`);
  }

  eliminarColaboradorTarea(colaboradorId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}tarea/colaborador/${colaboradorId}/eliminar/`);
  }

  eliminarHerramientaTarea(herramientaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}tarea/herramienta/${herramientaId}/eliminar/`);
  }

  eliminarMaterialTarea(materialId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}tarea/material/${materialId}/eliminar/`);
  }

  actualizarCantDias(colaboradorId: number, cantDias: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}tarea/colaborador/${colaboradorId}/actualizar_cant_dias/`, { cant_dias: cantDias });
  }
}
