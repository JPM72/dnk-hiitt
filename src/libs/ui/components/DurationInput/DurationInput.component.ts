import
{
	Component,
	signal, output, effect
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import _ from 'lodash'

const pad = (s) => _.padStart(s, 2, '0')
const formatTime = ($seconds: number | null) =>
{
	if (!$seconds) return '00:00:00'
	const hours = _.toInteger($seconds / 3600)
	const minutes = _.toInteger($seconds / 60) % 60
	const seconds = _.toInteger($seconds % 60)
	return [hours, minutes, seconds].map(pad).join(':')
}
const parseIntervals = (str: string) =>
{
	const [hours = 0, minutes = 0, seconds = 0] = str.split(':', 3).map(_.toInteger)
	return { hours, minutes, seconds }
}
const parseSeconds = (str: string) =>
{
	const { hours, minutes, seconds } = parseIntervals(str)
	return hours * 3600 + minutes * 60 + seconds
}

@Component({
	selector: 'app-duration-input',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule, MatInputModule,
	],
	templateUrl: './DurationInput.component.html',
	styleUrl: './DurationInput.component.scss',
})
export class DurationInputComponent
{
	seconds = signal(0)
	control = new FormControl<string>('00:00:00')
	overlay = new FormControl<string>('')

	secondsChanged = output<number>()

	constructor()
	{
		const { control, seconds, secondsChanged } = this
		control.valueChanges.subscribe(value => seconds.set(parseSeconds(value)))
		effect(() => secondsChanged.emit(seconds()))
	}

	private setFormattedValue(value = this.control.value)
	{
		const { control } = this
		const raw = control.value
		const formatted = formatTime(parseSeconds(raw))
		control.setValue(formatted)
	}

	onBeforeInput(event)
	{
		const { inputType, target } = event
		let data = event.data, value = target.value

		event.preventDefault()
		if (data && !/^\d+$/.test(data))
		{
			return
		} else if (data === null)
		{
			data = ''
			if (inputType === 'deleteContentBackward')
			{
				value = value.slice(0, -1)
			}
		}

		const str = _(`${value}${data}`).chain().replace(/:/g, '').padStart(6, '0').thru(
			s => _.chunk(s.slice(-6) as any, 2)
		).map(
			a => _.join(a, '')
		).join(':').value()
		this.control.setValue(str)
	}

	onBlur(event)
	{
		this.setFormattedValue()
	}
}
