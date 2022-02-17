import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalHistoryComponent } from './goal-history.component';

describe('GoalHistoryComponent', () => {
  let component: GoalHistoryComponent;
  let fixture: ComponentFixture<GoalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoalHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
