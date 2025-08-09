import { TestBed } from '@angular/core/testing';

import { DemoNluService } from './demo-nlu.service';

describe('DemoNluService', () => {
  let service: DemoNluService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoNluService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
