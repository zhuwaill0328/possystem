import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosInoutmodalComponent } from './pos-inoutmodal.component';

describe('PosInoutmodalComponent', () => {
  let component: PosInoutmodalComponent;
  let fixture: ComponentFixture<PosInoutmodalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosInoutmodalComponent]
    });
    fixture = TestBed.createComponent(PosInoutmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
