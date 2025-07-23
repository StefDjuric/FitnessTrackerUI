import { TestBed } from '@angular/core/testing';

import { WeightEntryService } from './weight-entry-service';

describe('WeightEntryService', () => {
  let service: WeightEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeightEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
