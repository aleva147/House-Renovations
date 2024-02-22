import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestAgencyDetailsComponent } from './guest-agency-details.component';

describe('GuestAgencyDetailsComponent', () => {
  let component: GuestAgencyDetailsComponent;
  let fixture: ComponentFixture<GuestAgencyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestAgencyDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestAgencyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
