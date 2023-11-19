import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosDebitHistoryComponent } from './pos-debit-history.component';

describe('PosDebitHistoryComponent', () => {
  let component: PosDebitHistoryComponent;
  let fixture: ComponentFixture<PosDebitHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosDebitHistoryComponent]
    });
    fixture = TestBed.createComponent(PosDebitHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
