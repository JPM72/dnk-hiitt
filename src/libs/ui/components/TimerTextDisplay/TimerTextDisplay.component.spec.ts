import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerTextDisplayComponent } from './TimerTextDisplay.component';

describe('TimerTextDisplayComponent', () => {
  let component: TimerTextDisplayComponent;
  let fixture: ComponentFixture<TimerTextDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerTextDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimerTextDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
