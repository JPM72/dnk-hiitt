import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PartitionPage } from './PartitionPage'

describe('PartitionPage', () => {
	let component: PartitionPage
	let fixture: ComponentFixture<PartitionPage>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PartitionPage],
		}).compileComponents()

		fixture = TestBed.createComponent(PartitionPage)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
