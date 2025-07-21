import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightProgress } from './weight-progress';

describe('WeightProgress', () => {
  let component: WeightProgress;
  let fixture: ComponentFixture<WeightProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightProgress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeightProgress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
