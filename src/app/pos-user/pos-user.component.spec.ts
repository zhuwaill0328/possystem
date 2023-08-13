import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSUserComponent } from './pos-user.component';

describe('POSUserComponent', () => {
  let component: POSUserComponent;
  let fixture: ComponentFixture<POSUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POSUserComponent]
    });
    fixture = TestBed.createComponent(POSUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
