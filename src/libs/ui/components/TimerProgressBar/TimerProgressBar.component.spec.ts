import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerProgressBarComponent } from './TimerProgressBar.component';

describe('TimerProgressBarComponent', () => {
  let component: TimerProgressBarComponent;
  let fixture: ComponentFixture<TimerProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerProgressBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimerProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
