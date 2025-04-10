import
{
	Component,
	inject,
	effect,
	signal, ElementRef,
	ChangeDetectionStrategy,
} from '@angular/core'
import { TimerStore } from './timer.store'
import { CommonModule } from '@angular/common'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-timer-progress-bar',
	imports: [
		CommonModule, MatProgressBarModule, MatButtonModule, MatIconModule,
		MatFormFieldModule, MatInputModule,
	],
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

	constructor(elementRef: ElementRef)
	{
		this.elementRef = elementRef

		effect(() =>
		{
			const bar = this.elementRef?.nativeElement.querySelector('.mdc-linear-progress__bar.mdc-linear-progress__primary-bar')
			if (bar)
			{
				bar.style.transition = this.store.isPaused()
					? ''
					: 'none'
			}
		})
	}

	reset()
	{
		console.log(this.elementRef.nativeElement)
		this.isResetting.set(true)
		this.store.stop()

		setTimeout(() => this.isResetting.set(false), 32)
	}
}
