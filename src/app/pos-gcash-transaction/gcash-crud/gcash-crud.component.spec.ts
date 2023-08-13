import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GcashCrudComponent } from './gcash-crud.component';

describe('GcashCrudComponent', () => {
  let component: GcashCrudComponent;
  let fixture: ComponentFixture<GcashCrudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GcashCrudComponent]
    });
    fixture = TestBed.createComponent(GcashCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
