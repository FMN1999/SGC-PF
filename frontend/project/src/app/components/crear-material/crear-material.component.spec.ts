import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMaterialComponent } from './crear-material.component';

describe('CrearMaterialComponent', () => {
  let component: CrearMaterialComponent;
  let fixture: ComponentFixture<CrearMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
