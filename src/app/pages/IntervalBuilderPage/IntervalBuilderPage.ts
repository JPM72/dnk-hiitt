import { Component, inject, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card'
import { SegmentsStore } from '@/libs/models/segment/segment.store'

@Component({
	selector: 'app-interval-builder-page',
	imports: [CommonModule, MatCardModule],
	templateUrl: './IntervalBuilderPage.html',
	styleUrl: './IntervalBuilderPage.scss',
	host: {
		class: 'page-container'
	},
	providers: [
		SegmentsStore
	]
})
export class IntervalBuilderPage
{
	readonly store = inject(SegmentsStore)

	allSegments = computed(() => this.store.segmentEntities())

	constructor()
	{
		const { store } = this
		if (typeof window !== 'undefined') Object.assign(window, {
			store
		})
		store.createOne({ duration: 1e3, label: 'Segment A' })
		store.createOne({ duration: 2e3, label: 'Segment B' })
		store.createOne({ duration: 3e3, label: 'Segment C' })
	}
}
