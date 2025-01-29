import { TestBed } from '@angular/core/testing';

import { PuestosConocidosService } from './puestos-conocidos.service';

describe('PuestosConocidosService', () => {
  let service: PuestosConocidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuestosConocidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
