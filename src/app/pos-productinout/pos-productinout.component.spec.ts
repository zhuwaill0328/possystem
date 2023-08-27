import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosProductinoutComponent } from './pos-productinout.component';

describe('PosProductinoutComponent', () => {
  let component: PosProductinoutComponent;
  let fixture: ComponentFixture<PosProductinoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosProductinoutComponent]
    });
    fixture = TestBed.createComponent(PosProductinoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
