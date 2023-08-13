import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSCategoryComponent } from './pos-category.component';

describe('POSCategoryComponent', () => {
  let component: POSCategoryComponent;
  let fixture: ComponentFixture<POSCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POSCategoryComponent]
    });
    fixture = TestBed.createComponent(POSCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
