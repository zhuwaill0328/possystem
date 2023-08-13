import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSDashboardComponent } from './pos-dashboard.component';

describe('POSDashboardComponent', () => {
  let component: POSDashboardComponent;
  let fixture: ComponentFixture<POSDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POSDashboardComponent]
    });
    fixture = TestBed.createComponent(POSDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
