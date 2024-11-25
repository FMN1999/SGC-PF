import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanzasObraComponent } from './finanzas-obra.component';

describe('FinanzasObraComponent', () => {
  let component: FinanzasObraComponent;
  let fixture: ComponentFixture<FinanzasObraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanzasObraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanzasObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
