import
{
	Component,
	computed,
	ElementRef, ViewChild
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { IMask, IMaskModule, IMaskDirective, } from 'angular-imask'
import _ from 'lodash'

const parseMask = (str: string) =>
{
	console.log(str)
	const [min, sec] = str.split(':', 2).map(s => _.defaultTo(_.toInteger(s), 0))
	const v = min * 60 + sec
	console.log(v)
	return v
}

const MASK_OPTIONS = {
	mask: 'mm\\:ss',
	placeholderChar: '0',
	// lazy: false,
	// overwrite: true,
	blocks: {
		mm: {
			mask: IMask.MaskedRange,
			from: 0, to: 59,
			maxLength: 2,
		},
		ss: {
			mask: IMask.MaskedRange,
			from: 0, to: 59,
			maxLength: 2,
		},
	}
}

const pad = (s) => _.padStart(s, 2, '0')
const formatValue = ($seconds: number | null) =>
{
	if (!$seconds) return '00:00:00'
	const hours = _.toInteger($seconds / 3600)
	const minutes = _.toInteger($seconds / 60) % 60
	const seconds = _.toInteger($seconds % 60)
	return [hours, minutes, seconds].map(pad).join(':')
}
const parseSeconds = (str: string) =>
{
	const [hours = 0, minutes = 0, seconds = 0] = str.split(':', 3).map(_.toInteger)
	return hours * 3600 + minutes * 60 + seconds
}

@Component({
	selector: 'app-duration-input',
	imports: [CommonModule, IMaskModule, ReactiveFormsModule],
	templateUrl: './DurationInput.component.html',
	styleUrl: './DurationInput.component.scss',
})
export class DurationInputComponent
{

	value
	control = new FormControl<string>('00:00:00')
	// mask = MASK_OPTIONS
	// @ViewChild(IMaskDirective, { static: false })
	// iMask: IMaskDirective<typeof MASK_OPTIONS>

	constructor()
	{
		// this.elementRef = elementRef
		// this.directiveRef = directiveRef
		this.control.valueChanges.subscribe(console.log)
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

		const seconds = parseSeconds(str)
		this.value = seconds

		// target.value = str
		this.control.setValue(str)
		console.log(this.control.getRawValue())
	}

	onInput(event)
	{
		console.log(event)
	}
	onSelect(event)
	{
		console.log(event)
	}
	onKeyDown(event)
	{
		console.log(event)
	}

	// onAccept(value)
	// {
	// 	console.log('on accept', ...arguments)
	// 	console.log(this)
	// }
	// onComplete()
	// {
	// 	console.log('on complete', ...arguments)
	// }

	// ngAfterViewInit(): void
	// {
	// 	this.iMask.maskRef.updateOptions(
	// 		_.merge({}, MASK_OPTIONS, {
	// 			blocks: {
	// 				mm: {
	// 					autofix: 'pad',
	// 				},
	// 				ss: {
	// 					autofix: 'pad',
	// 				},
	// 			}
	// 		} as any)
	// 	)
	// }
}
