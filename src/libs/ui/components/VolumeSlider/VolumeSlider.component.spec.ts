import { ComponentFixture, TestBed } from '@angular/core/testing'
import { VolumeSlider } from './VolumeSlider.component'

describe('VolumeSlider', () => {
	let component: VolumeSlider
	let fixture: ComponentFixture<VolumeSlider>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [VolumeSlider],
		}).compileComponents()

		fixture = TestBed.createComponent(VolumeSlider)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
