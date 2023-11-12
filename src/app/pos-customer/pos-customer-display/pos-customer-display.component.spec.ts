import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCustomerDisplayComponent } from './pos-customer-display.component';

describe('PosCustomerDisplayComponent', () => {
  let component: PosCustomerDisplayComponent;
  let fixture: ComponentFixture<PosCustomerDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosCustomerDisplayComponent]
    });
    fixture = TestBed.createComponent(PosCustomerDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
