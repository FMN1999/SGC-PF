import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteObraComponent } from './reporte-obra.component';

describe('ReporteObraComponent', () => {
  let component: ReporteObraComponent;
  let fixture: ComponentFixture<ReporteObraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteObraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
