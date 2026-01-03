import { CommonModule } from '@angular/common'
import { Component, inject, computed, OnInit } from '@angular/core'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { TimerButtonControlsComponent } from '@/libs/ui/components/TimerButtonControls/TimerButtonControls.component'
import { DurationInputComponent } from '@/libs/ui/components/DurationInput/DurationInput.component'
import { TimerTextDisplayComponent } from '@/libs/ui/components/TimerTextDisplay/TimerTextDisplay.component'
import { PartitionStore } from '@/libs/models/partition/partition.store'
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
		class: 'page-container'
	},
	providers: [
		PartitionStore,
	]
})
export class PartitionPage implements OnInit
{
	readonly PROGRESS_SPINNER_DIAMETER = 352;
	readonly store = inject(PartitionStore)

	activeDurationSeconds = computed(() => floor(this.store.activeDuration() / 1e3))
	restDurationSeconds = computed(() => floor(this.store.restDuration() / 1e3))
	onEnterCallback: Function

	buttonsDisabledState = computed(() => !this.store.totalDuration())

	ngOnInit(): void
	{
		const { store } = this
		if (typeof window !== 'undefined') _.merge(window, {
			partitionStore: store
		})
		this.onEnterCallback = () => store.play()
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
		this.store.play()
	}

	onStop()
	{
		this.store.stop()
	}
}
