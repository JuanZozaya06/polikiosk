import { TestBed } from '@angular/core/testing';

import { AutoResetService } from './auto-reset.service';

describe('AutoResetService', () => {
  let service: AutoResetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoResetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
