import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosDebitRepaymentComponent } from './pos-debit-repayment.component';

describe('PosDebitRepaymentComponent', () => {
  let component: PosDebitRepaymentComponent;
  let fixture: ComponentFixture<PosDebitRepaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosDebitRepaymentComponent]
    });
    fixture = TestBed.createComponent(PosDebitRepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
