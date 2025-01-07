import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceFinancieroComponent } from './balance-financiero.component';

describe('BalanceFinancieroComponent', () => {
  let component: BalanceFinancieroComponent;
  let fixture: ComponentFixture<BalanceFinancieroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceFinancieroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceFinancieroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
