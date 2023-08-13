import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSSidenavComponent } from './pos-sidenav.component';

describe('POSSidenavComponent', () => {
  let component: POSSidenavComponent;
  let fixture: ComponentFixture<POSSidenavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POSSidenavComponent]
    });
    fixture = TestBed.createComponent(POSSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
