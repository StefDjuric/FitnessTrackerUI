import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressChangeModal } from './progress-change-modal';

describe('ProgressChangeModal', () => {
  let component: ProgressChangeModal;
  let fixture: ComponentFixture<ProgressChangeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressChangeModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressChangeModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
