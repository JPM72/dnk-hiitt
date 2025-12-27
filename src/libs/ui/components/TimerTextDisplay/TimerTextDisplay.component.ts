import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatTime } from '@/libs/utils';

@Component({
  selector: 'app-timer-text-display',
  imports: [CommonModule],
  templateUrl: './TimerTextDisplay.component.html',
  styleUrl: './TimerTextDisplay.component.scss',
})
export class TimerTextDisplayComponent {
	milliseconds = input(0)
	showMilliseconds = input(true)

	time = computed(() => formatTime(this.milliseconds()))
}
