import { TestBed } from '@angular/core/testing';

import { OverlayManagerService } from './overlay-manager.service';

describe('OverlayManagerService', () => {
  let service: OverlayManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverlayManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
