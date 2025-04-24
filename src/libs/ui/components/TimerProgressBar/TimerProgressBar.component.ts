import _ from 'lodash'
import
{
	Component,
	inject,
	effect, computed,
	signal, ElementRef,
	ChangeDetectionStrategy,
	viewChildren,
} from '@angular/core'
import { TimerStore } from './timer.store'
import { CommonModule } from '@angular/common'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatFabButton, MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { WakeLockService } from '@/libs/services'

const MDC_PRIMARY_BAR_SELECTOR = '.mdc-linear-progress__bar.mdc-linear-progress__primary-bar'

@Component({
	selector: 'app-timer-progress-bar',
	imports: [
		CommonModule, MatProgressBarModule, MatButtonModule, MatIconModule,
		MatFormFieldModule, MatInputModule,
		ReactiveFormsModule,
	],
	templateUrl: './TimerProgressBar.component.html',
	styleUrl: './TimerProgressBar.component.scss',
	providers: [TimerStore],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerProgressBarComponent
{
	readonly store = inject(TimerStore)
	readonly wakeLock = inject(WakeLockService)

	minutes = new FormControl<number>(null)
	seconds = new FormControl<number>(null)
	rounds = new FormControl<number>(null)

	roundsText = computed(() =>
	{
		const currentTime = this.store.currentTime()
		if (!currentTime) return null

		const rounds = this.store.rounds()
		const currentRound = this.store.currentRound() + 1

		if (rounds === null)
		{
			return currentRound
		} else
		{
			return `${currentRound} / ${rounds}`
		}

	})

	elementRef: ElementRef
	buttonControls = viewChildren(MatFabButton)

	isResetting = signal<boolean>(false)

	constructor(elementRef: ElementRef)
	{
		this.elementRef = elementRef

		effect(() =>
		{
			const bar = this.elementRef?.nativeElement.querySelector(MDC_PRIMARY_BAR_SELECTOR)
			if (bar) bar.style.transition = this.isResetting() ? '' : 'none'
		})

		const INPUT_KEYS = ['minutes', 'seconds', 'rounds'] as const

		const { store } = this

		for (const key of INPUT_KEYS)
		{
			this[key].valueChanges.subscribe(value => store.update({ [key]: value }))
		}

		effect(() =>
		{
			const method = store.isPaused() ? 'enable' : 'disable'
			_(this).at(INPUT_KEYS).invokeMap(method).value()
		})
		effect(() =>
		{
			const { wakeLock } = this
			if (store.intervalId())
			{
				wakeLock.request()
			} else
			{
				wakeLock.release()
			}
		})
		effect(() =>
		{
			const disabled = !Boolean(store.intervalDuration())
			this.buttonControls().forEach(button => (button.disabled = disabled))
		})
	}

	reset()
	{
		this.isResetting.set(true)
		this.store.stop()

		setTimeout(() => this.isResetting.set(false), 32)
	}
}
