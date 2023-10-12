import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosPaymentModalComponent } from './pos-payment-modal.component';

describe('PosPaymentModalComponent', () => {
  let component: PosPaymentModalComponent;
  let fixture: ComponentFixture<PosPaymentModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosPaymentModalComponent]
    });
    fixture = TestBed.createComponent(PosPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
