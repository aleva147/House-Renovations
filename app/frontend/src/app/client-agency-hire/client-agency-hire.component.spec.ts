import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAgencyHireComponent } from './client-agency-hire.component';

describe('ClientAgencyHireComponent', () => {
  let component: ClientAgencyHireComponent;
  let fixture: ComponentFixture<ClientAgencyHireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAgencyHireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAgencyHireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
