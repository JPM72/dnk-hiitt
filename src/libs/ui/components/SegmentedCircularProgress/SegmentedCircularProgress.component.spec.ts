import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SegmentedCircularProgressComponent } from './SegmentedCircularProgress.component';

describe('SegmentedCircularProgressComponent', () => {
  let component: SegmentedCircularProgressComponent;
  let fixture: ComponentFixture<SegmentedCircularProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentedCircularProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SegmentedCircularProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
