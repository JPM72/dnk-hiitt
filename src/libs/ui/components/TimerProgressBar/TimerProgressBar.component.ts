import
{
	ViewEncapsulation,
	Component,
	inject,
	effect,
	signal, computed, ElementRef,
	ChangeDetectionStrategy,
} from '@angular/core'
import { TimerStore } from './timer.store'
import { CommonModule } from '@angular/common'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

function formatTime(t: number | null): string
{
	if (!t) return '00:00.000'

	const minutes = `${(t / 60000) | 0}`.padStart(2, '0')
	const seconds = `${(t / 1000) % 60 | 0}`.padStart(2, '0')
	const milliseconds = `${t % 1000}`.padStart(3, '0')
	return `${minutes}:${seconds}.${milliseconds}`
}

@Component({
	selector: 'app-timer-progress-bar',
	imports: [CommonModule, MatProgressBarModule, MatButtonModule, MatIconModule],
	templateUrl: './TimerProgressBar.component.html',
	styleUrl: './TimerProgressBar.component.scss',
	providers: [TimerStore],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerProgressBarComponent
{
	readonly store = inject(TimerStore)

	elementRef: ElementRef
	isResetting = signal<boolean>(false)

	// startTime: number = performance.now()
	// elapsed = signal<number>(0)
	// paused = signal<boolean>(false)
	// progress = computed(() => Math.min(100, 100 * (this.elapsed() / 60000)))
	// timeText = computed(() => formatTime(Math.round(this.elapsed())))

	constructor(elementRef: ElementRef)
	{
		this.elementRef = elementRef
		// this.elapsed.set(0)

		effect(() =>
		{
			const bar = this.elementRef?.nativeElement.querySelector('.mdc-linear-progress__bar.mdc-linear-progress__primary-bar')
			if (bar)
			{
				// bar.style.transition = this.isResetting()
				// ? 'none'
				// : ''
				bar.style.transition = this.store.isPaused()
					? ''
					: 'none'
			}
		})
	}

	// setElapsed()
	// {
	// 	if (this.paused()) return
	// 	const current = this.elapsed()
	// 	const now = performance.now()
	// 	if (current >= 60e3) this.startTime = now
	// 	this.elapsed.set(now - this.startTime)
	// }

	reset()
	{
		console.log(this.elementRef.nativeElement)
		this.isResetting.set(true)
		this.store.stop()
		// const now = performance.now()
		// this.startTime = now
		// this.elapsed.set(0)

		setTimeout(() => this.isResetting.set(false), 32)
	}

	// start()
	// {
	// 	setInterval(() =>
	// 	{
	// 		this.setElapsed()
	// 	}, 16)
	// 	this.playSound()
	// }

	// pause(paused = !this.paused())
	// {
	// 	this.paused.set(!!paused)
	// }

	playSound()
	{
		const audio = new Audio('/sounds/beep.mp3')
		// audio.play()
	}
}
