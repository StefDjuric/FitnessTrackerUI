import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetHabitGoals } from './set-habit-goals';

describe('SetHabitGoals', () => {
  let component: SetHabitGoals;
  let fixture: ComponentFixture<SetHabitGoals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetHabitGoals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetHabitGoals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
