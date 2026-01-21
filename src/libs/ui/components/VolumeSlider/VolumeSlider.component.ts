import { Component, inject } from '@angular/core'
import { MatSliderModule } from '@angular/material/slider'
import { MatIconModule } from '@angular/material/icon'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { AudioService } from '@/libs/services/audio.service'

@Component({
	selector: 'app-volume-slider',
	imports: [ReactiveFormsModule, MatSliderModule, MatIconModule],
	templateUrl: './VolumeSlider.component.html',
	styleUrl: './VolumeSlider.component.scss',
})
export class VolumeSlider {
	readonly audio = inject(AudioService)

	volume = new FormControl<number>(this.audio.volume)
	constructor() {
		this.volume.valueChanges.subscribe((v) => {
			this.audio.volume = v
		})
	}
}
