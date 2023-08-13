import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSProductsComponent } from './pos-products.component';

describe('POSProductsComponent', () => {
  let component: POSProductsComponent;
  let fixture: ComponentFixture<POSProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POSProductsComponent]
    });
    fixture = TestBed.createComponent(POSProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
