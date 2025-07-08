import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightliftingLogForm } from './weightlifting-log-form';

describe('WeightliftingLogForm', () => {
  let component: WeightliftingLogForm;
  let fixture: ComponentFixture<WeightliftingLogForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightliftingLogForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeightliftingLogForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
