import { Component, input, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import _ from 'lodash'

function getStrokeDashArray({ step, steps, spacingSize, radius })
{
	if (!steps || !radius) return 'none'

	const circumference = radius * 2 * Math.PI
	const stepSize = `${(circumference / steps) - spacingSize}`

	const str = `${stepSize} ${spacingSize}`

	return _(step - 1).chain().times(() => str).push(`${stepSize} ${circumference * 10}`).join(' ').value()
}

@Component({
	selector: 'app-segmented-circular-progress',
	imports: [CommonModule],
	templateUrl: './SegmentedCircularProgress.component.html',
	styleUrl: './SegmentedCircularProgress.component.scss',
	host: {
		'[style.width.px]': 'width()',
		'[style.height.px]': 'width()',
	}
})
export class SegmentedCircularProgressComponent
{
	step = input<number>(7)
	steps = input<number>(10)
	spacingSize = input<number>(10)
	radius = input<number>(184)
	width = computed(() => this.radius() * 2)
	backgroundStrokeDashArray = computed(() =>
	{
		return getStrokeDashArray({
			step: this.steps(),
			steps: this.steps(),
			spacingSize: this.spacingSize(),
			radius: this.radius()
		})
	})
	circleStyles = computed(() =>
	{
		const step = this.step()
		console.log(step)
		if (!step) return {
			stroke: 'none'
		}

		return {
			'stroke-dasharray': getStrokeDashArray({
				step,
				steps: this.steps(),
				spacingSize: this.spacingSize(),
				radius: this.radius()
			})
		}
	})
}
