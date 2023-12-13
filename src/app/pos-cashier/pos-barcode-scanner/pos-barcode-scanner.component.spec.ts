import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosBarcodeScannerComponent } from './pos-barcode-scanner.component';

describe('PosBarcodeScannerComponent', () => {
  let component: PosBarcodeScannerComponent;
  let fixture: ComponentFixture<PosBarcodeScannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosBarcodeScannerComponent]
    });
    fixture = TestBed.createComponent(PosBarcodeScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
