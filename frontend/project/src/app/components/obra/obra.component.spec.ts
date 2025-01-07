import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObraComponent } from './obra.component';

describe('ObraComponent', () => {
  let component: ObraComponent;
  let fixture: ComponentFixture<ObraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
