import { Segment } from '@/libs/models/segment/segment.model'
import { Component, input, computed } from '@angular/core'
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-segment',
	imports: [MatCardModule],
	templateUrl: './Segment.component.html',
	styleUrl: './Segment.component.scss',
})
export class SegmentComponent {
	segment = input.required<Segment>()
}
