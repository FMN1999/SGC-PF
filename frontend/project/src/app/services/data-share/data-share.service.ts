import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataShareService {
  private obraIdSource = new BehaviorSubject<number | null>(null);
  obraId$ = this.obraIdSource.asObservable();

  setObraId(obraId: number) {
    this.obraIdSource.next(obraId);
  }
}
