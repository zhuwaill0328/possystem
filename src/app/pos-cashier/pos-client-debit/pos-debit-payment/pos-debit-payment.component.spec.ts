import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosDebitPaymentComponent } from './pos-debit-payment.component';

describe('PosDebitPaymentComponent', () => {
  let component: PosDebitPaymentComponent;
  let fixture: ComponentFixture<PosDebitPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosDebitPaymentComponent]
    });
    fixture = TestBed.createComponent(PosDebitPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
