import { TestBed } from '@angular/core/testing';

import { SubcontratacionService } from './subcontratacion.service';

describe('SubcontratacionService', () => {
  let service: SubcontratacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubcontratacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
