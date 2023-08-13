import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSLoginComponent } from './pos-login.component';

describe('POSLoginComponent', () => {
  let component: POSLoginComponent;
  let fixture: ComponentFixture<POSLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POSLoginComponent]
    });
    fixture = TestBed.createComponent(POSLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
