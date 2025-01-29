import { TestBed } from '@angular/core/testing';

import { MaterialesConocidosService } from './materiales-conocidos.service';

describe('MaterialesConocidosService', () => {
  let service: MaterialesConocidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialesConocidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
