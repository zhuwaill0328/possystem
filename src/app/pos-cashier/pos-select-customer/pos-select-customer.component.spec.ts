import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSelectCustomerComponent } from './pos-select-customer.component';

describe('PosSelectCustomerComponent', () => {
  let component: PosSelectCustomerComponent;
  let fixture: ComponentFixture<PosSelectCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosSelectCustomerComponent]
    });
    fixture = TestBed.createComponent(PosSelectCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
