import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAgencyWorkersComponent } from './admin-agency-workers.component';

describe('AdminAgencyWorkersComponent', () => {
  let component: AdminAgencyWorkersComponent;
  let fixture: ComponentFixture<AdminAgencyWorkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAgencyWorkersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAgencyWorkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
