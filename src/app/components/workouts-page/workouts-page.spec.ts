import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutsPage } from './workouts-page';

describe('WorkoutsPage', () => {
  let component: WorkoutsPage;
  let fixture: ComponentFixture<WorkoutsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
