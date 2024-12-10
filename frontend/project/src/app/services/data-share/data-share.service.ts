import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataShareService {
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
