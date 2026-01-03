import { Component, input, output, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { noop } from 'lodash'

export interface TimerButtonControlsDisabledState
{
	start: Boolean
	stop: Boolean
}

const parseDisabledState = (key: keyof TimerButtonControlsDisabledState, state: Boolean | TimerButtonControlsDisabledState): Boolean =>
{
	if (typeof state === 'boolean')
	{
		return state
	} else
	{
		return (state as TimerButtonControlsDisabledState)?.[key] === true
	}
}

@Component({
	selector: 'app-timer-button-controls',
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
	],
	templateUrl: './TimerButtonControls.component.html',
	styleUrl: './TimerButtonControls.component.scss',
})
export class TimerButtonControlsComponent
{
	isPaused = input<Boolean>(false)
	start = output<void>()
	stop = output<void>()
	isDisabled = input<Boolean | TimerButtonControlsDisabledState>(false)

	isStartDisabled = computed(() => parseDisabledState('start', this.isDisabled()))
	isStopDisabled = computed(() => parseDisabledState('stop', this.isDisabled()))
}
