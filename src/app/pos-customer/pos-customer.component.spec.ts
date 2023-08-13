import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSCustomerComponent } from './pos-customer.component';

describe('POSCustomerComponent', () => {
  let component: POSCustomerComponent;
  let fixture: ComponentFixture<POSCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POSCustomerComponent]
    });
    fixture = TestBed.createComponent(POSCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
