import { ComponentFixture, TestBed } from '@angular/core/testing'
import { IntervalBuilderPage } from './IntervalBuilderPage'

describe('IntervalBuilderPage', () => {
	let component: IntervalBuilderPage
	let fixture: ComponentFixture<IntervalBuilderPage>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IntervalBuilderPage],
		}).compileComponents()

		fixture = TestBed.createComponent(IntervalBuilderPage)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
