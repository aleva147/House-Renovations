import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyClientDetailsComponent } from './agency-client-details.component';

describe('AgencyClientDetailsComponent', () => {
  let component: AgencyClientDetailsComponent;
  let fixture: ComponentFixture<AgencyClientDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyClientDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyClientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
