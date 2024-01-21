import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCalcComponent } from './pos-calc.component';

describe('PosCalcComponent', () => {
  let component: PosCalcComponent;
  let fixture: ComponentFixture<PosCalcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosCalcComponent]
    });
    fixture = TestBed.createComponent(PosCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
