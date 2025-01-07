import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearObraComponent } from './crear-obra.component';

describe('CrearObraComponent', () => {
  let component: CrearObraComponent;
  let fixture: ComponentFixture<CrearObraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearObraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
