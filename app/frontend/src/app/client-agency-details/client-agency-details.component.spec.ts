import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAgencyDetailsComponent } from './client-agency-details.component';

describe('ClientAgencyDetailsComponent', () => {
  let component: ClientAgencyDetailsComponent;
  let fixture: ComponentFixture<ClientAgencyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAgencyDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAgencyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
