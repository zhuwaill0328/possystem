import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSTransactionComponent } from './pos-transaction.component';

describe('POSTransactionComponent', () => {
  let component: POSTransactionComponent;
  let fixture: ComponentFixture<POSTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POSTransactionComponent]
    });
    fixture = TestBed.createComponent(POSTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
