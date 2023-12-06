import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSearchproductComponent } from './pos-searchproduct.component';

describe('PosSearchproductComponent', () => {
  let component: PosSearchproductComponent;
  let fixture: ComponentFixture<PosSearchproductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosSearchproductComponent]
    });
    fixture = TestBed.createComponent(PosSearchproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
