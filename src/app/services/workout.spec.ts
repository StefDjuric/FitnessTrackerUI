import { TestBed } from '@angular/core/testing';

import { Workout } from './workout';

describe('Workout', () => {
  let service: Workout;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Workout);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
