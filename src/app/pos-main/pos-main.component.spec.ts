import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSMainComponent } from './pos-main.component';

describe('POSMainComponent', () => {
  let component: POSMainComponent;
  let fixture: ComponentFixture<POSMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POSMainComponent]
    });
    fixture = TestBed.createComponent(POSMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
