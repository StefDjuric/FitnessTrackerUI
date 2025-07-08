import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogRun } from './log-run';

describe('LogRun', () => {
  let component: LogRun;
  let fixture: ComponentFixture<LogRun>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogRun]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogRun);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
