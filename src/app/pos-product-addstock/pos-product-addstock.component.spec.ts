import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosProductAddstockComponent } from './pos-product-addstock.component';

describe('PosProductAddstockComponent', () => {
  let component: PosProductAddstockComponent;
  let fixture: ComponentFixture<PosProductAddstockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosProductAddstockComponent]
    });
    fixture = TestBed.createComponent(PosProductAddstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
