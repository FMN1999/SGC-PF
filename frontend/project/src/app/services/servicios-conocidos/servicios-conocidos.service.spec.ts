import { TestBed } from '@angular/core/testing';

import { ServiciosConocidosService } from './servicios-conocidos.service';

describe('ServiciosConocidosService', () => {
  let service: ServiciosConocidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosConocidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
