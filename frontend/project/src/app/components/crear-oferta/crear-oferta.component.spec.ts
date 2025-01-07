import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearOfertaComponent } from './crear-oferta.component';

describe('CrearOfertaComponent', () => {
  let component: CrearOfertaComponent;
  let fixture: ComponentFixture<CrearOfertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearOfertaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
