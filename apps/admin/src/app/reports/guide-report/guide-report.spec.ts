import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideReport } from './guide-report';

describe('GuideReport', () => {
  let component: GuideReport;
  let fixture: ComponentFixture<GuideReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuideReport],
    }).compileComponents();

    fixture = TestBed.createComponent(GuideReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
