import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyObjecttDetailsComponent } from './agency-objectt-details.component';

describe('AgencyObjecttDetailsComponent', () => {
  let component: AgencyObjecttDetailsComponent;
  let fixture: ComponentFixture<AgencyObjecttDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyObjecttDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyObjecttDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
