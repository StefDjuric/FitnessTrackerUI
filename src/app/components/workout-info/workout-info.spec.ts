import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutInfo } from './workout-info';

describe('WorkoutInfo', () => {
  let component: WorkoutInfo;
  let fixture: ComponentFixture<WorkoutInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
