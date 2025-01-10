import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataShareService {
  // Variables para permisos inicializadas en false
  permiso1: boolean = false;
  permiso2: boolean = false;
  permiso3: boolean = false;
  permiso4: boolean = false;
  permiso5: boolean = false;
  permiso6: boolean = false;
  permiso7: boolean = false;
  permiso8: boolean = false;
  permiso9: boolean = false;
  permiso10: boolean = false;
  permiso11: boolean = false;
  permiso12: boolean = false;
  permiso13: boolean = false;
  permiso14: boolean = false;
  permiso15: boolean = false;
  permiso16: boolean = false;

  private obraIdSource = new BehaviorSubject<number | null>(null);
  obraId$ = this.obraIdSource.asObservable();

  private clienteIdSource = new BehaviorSubject<number | null>(null);
  clienteId$ = this.clienteIdSource.asObservable();

  private isVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isVisible$ = this.isVisibleSubject;

  toggleVisibility() {
    this.isVisibleSubject.next(!this.isVisibleSubject.value);
  }

  showChat() {
    this.isVisibleSubject.next(true);
  }

  hideChat() {
    this.isVisibleSubject.next(false);
  }

  setObraId(obraId: number) {
    this.obraIdSource.next(obraId);
  }

  setClienteId(clienteId: number) {
    this.clienteIdSource.next(clienteId);
  }

}
