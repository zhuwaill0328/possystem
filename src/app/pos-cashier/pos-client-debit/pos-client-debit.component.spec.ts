import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosClientDebitComponent } from './pos-client-debit.component';

describe('PosClientDebitComponent', () => {
  let component: PosClientDebitComponent;
  let fixture: ComponentFixture<PosClientDebitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosClientDebitComponent]
    });
    fixture = TestBed.createComponent(PosClientDebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
