import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosGcashModalComponent } from './pos-gcash-modal.component';

describe('PosGcashModalComponent', () => {
  let component: PosGcashModalComponent;
  let fixture: ComponentFixture<PosGcashModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosGcashModalComponent]
    });
    fixture = TestBed.createComponent(PosGcashModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
