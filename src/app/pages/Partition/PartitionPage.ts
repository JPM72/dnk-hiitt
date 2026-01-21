import { CommonModule } from '@angular/common'
import { Component, inject, computed, OnInit, ElementRef, effect } from '@angular/core'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { TimerButtonControlsComponent } from '@/libs/ui/components/TimerButtonControls/TimerButtonControls.component'
import { DurationInputComponent } from '@/libs/ui/components/DurationInput/DurationInput.component'
import { TimerTextDisplayComponent } from '@/libs/ui/components/TimerTextDisplay/TimerTextDisplay.component'
import { PartitionStore } from '@/libs/models/partition/partition.store'
import { AudioService } from '@/libs/services/audio.service'
import _ from 'lodash'

const { floor } = Math

@Component({
	selector: 'app-partition-page',
	imports: [
		CommonModule,
		DurationInputComponent,
		TimerTextDisplayComponent,
		TimerButtonControlsComponent,
		MatProgressSpinnerModule,
	],
	templateUrl: './PartitionPage.html',
	styleUrl: './PartitionPage.scss',
	host: {
		class: 'page-container',
		'(window:keydown)': 'handleWindowKeyDown($event)'
	},
	providers: [
		PartitionStore,
	]
})
export class PartitionPage implements OnInit
{
	readonly PROGRESS_SPINNER_DIAMETER = 352;
	readonly store = inject(PartitionStore)
	readonly audio = inject(AudioService)
	activeDurationSeconds = computed(() => floor(this.store.activeDuration() / 1e3))
	restDurationSeconds = computed(() => floor(this.store.restDuration() / 1e3))
	onEnterCallback: Function
	buttonsDisabledState = computed(() => !this.store.totalDuration())
	elementRef: ElementRef
	previousRound: number | null
	previousPortion: string | null = null

	constructor(elementRef: ElementRef)
	{
		this.elementRef = elementRef
		const { store } = this
		effect(() =>
		{
			const portion = store.currentPortion()
			const isPaused = store.isPaused()
			if (portion !== this.previousPortion)
			{
				if (!isPaused && portion !== null)
				{
					this.audio.play('beep', 'beep.mp3')
				}
				this.previousPortion = portion
			}
		})
	}

	ngOnInit(): void
	{
		const { store } = this
		if (typeof window !== 'undefined') _.merge(window, {
			partitionStore: store
		})
		this.onEnterCallback = () => this.onStart()
	}

	onActiveDurationSecondsChange(duration: number)
	{
		this.store.setActiveDuration(duration * 1e3)
	}
	onRestDurationSecondsChange(duration: number)
	{
		this.store.setRestDuration(duration * 1e3)
	}

	onStart()
	{
		this.store.safePlay()
	}

	onStop()
	{
		this.store.stop()
	}

	handleWindowKeyDown(event: KeyboardEvent)
	{
		const { code } = event
		if (code !== 'Space') return
		const target = event.target as HTMLElement
		const { nodeName } = target
		if (nodeName === 'BODY')
		{
			this.onStart()
			event.preventDefault()
		}
	}
}
