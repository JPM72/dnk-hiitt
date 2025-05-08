import _ from 'lodash'
import
{
	Component,
	inject,
	effect, computed,
	signal, ElementRef,
	ChangeDetectionStrategy,
	viewChildren,
	AfterViewInit,
} from '@angular/core'
import { TimerStore } from './timer.store'
import { CommonModule } from '@angular/common'
import { MatProgressSpinner, MatProgressSpinnerModule, MatProgressSpinnerDefaultOptions, MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS } from '@angular/material/progress-spinner'
import { MatFabButton, MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { WakeLockService } from '@/libs/services'
import { DurationInputComponent } from '../DurationInput/DurationInput.component'
import { SegmentedCircularProgressComponent } from '../SegmentedCircularProgress/SegmentedCircularProgress.component'

const MDC_DISABLE_TRANSITION_SELECTOR = '.progress-spinner-container mat-progress-spinner:not(.background-spinner) .mdc-circular-progress__determinate-circle'

const customSpinnerOptions: MatProgressSpinnerDefaultOptions = {
	diameter: 352,
}

@Component({
	selector: 'app-timer-progress-bar',
	imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
    ReactiveFormsModule,
    SegmentedCircularProgressComponent,
    // DurationInputComponent
],
	templateUrl: './TimerProgressBar.component.html',
	styleUrl: './TimerProgressBar.component.scss',
	providers: [
		TimerStore,
		{
			provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
			useValue: customSpinnerOptions
		}
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerProgressBarComponent implements AfterViewInit
{
	readonly store = inject(TimerStore)
	readonly wakeLock = inject(WakeLockService)

	minutes = new FormControl<number>(null)
	seconds = new FormControl<number>(null)
	rounds = new FormControl<number>(null)

	currentStep = computed(() => this.store.currentRound() + 1)

	roundsText = computed(() =>
	{
		const currentTime = this.store.currentTime()
		if (!currentTime) return null

		const rounds = this.store.rounds()
		// const currentRound = this.store.currentRound() + 1
		const currentRound = this.currentStep()

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
	progressSpinners = viewChildren(MatProgressSpinner)

	isResetting = signal<boolean>(false)

	constructor(elementRef: ElementRef)
	{
		this.elementRef = elementRef

		effect(() =>
		{
			const bar = this.elementRef?.nativeElement.querySelector(MDC_DISABLE_TRANSITION_SELECTOR)
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

	ngAfterViewInit()
	{
		const spinners = this.progressSpinners()
		spinners.forEach(spinner =>
		{
			spinner._elementRef.nativeElement.style.overflow = 'visible'
			const svg = spinner._determinateCircle.nativeElement.querySelector('svg')
			svg.style.overflow = 'visible'
		})
	}
}
