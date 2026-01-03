import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TimerButtonControlsComponent } from './TimerButtonControls.component'

describe('TimerButtonControlsComponent', () => {
	let component: TimerButtonControlsComponent
	let fixture: ComponentFixture<TimerButtonControlsComponent>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TimerButtonControlsComponent],
		}).compileComponents()

		fixture = TestBed.createComponent(TimerButtonControlsComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
