import { Component } from '@angular/core'
import { TimerProgressBarComponent } from '@/libs/ui/components/TimerProgressBar/TimerProgressBar.component'

@Component({
	selector: 'app-timer-page',
	imports: [
		TimerProgressBarComponent,
	],
	templateUrl: './TimerPage.html',
	styleUrl: './TimerPage.scss',
	host: {
		class: 'page-container'
	}
})
export class TimerPage {}
