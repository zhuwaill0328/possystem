import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSGcashTransactionComponent } from './pos-gcash-transaction.component';

describe('POSGcashTransactionComponent', () => {
  let component: POSGcashTransactionComponent;
  let fixture: ComponentFixture<POSGcashTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POSGcashTransactionComponent]
    });
    fixture = TestBed.createComponent(POSGcashTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
