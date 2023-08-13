import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSCashierComponent } from './pos-cashier.component';

describe('POSCashierComponent', () => {
  let component: POSCashierComponent;
  let fixture: ComponentFixture<POSCashierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POSCashierComponent]
    });
    fixture = TestBed.createComponent(POSCashierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
