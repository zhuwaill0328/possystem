import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosOnlineDashboardComponent } from './pos-online-dashboard.component';

describe('PosOnlineDashboardComponent', () => {
  let component: PosOnlineDashboardComponent;
  let fixture: ComponentFixture<PosOnlineDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosOnlineDashboardComponent]
    });
    fixture = TestBed.createComponent(PosOnlineDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
