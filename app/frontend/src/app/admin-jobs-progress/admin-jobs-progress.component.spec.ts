import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJobsProgressComponent } from './admin-jobs-progress.component';

describe('AdminJobsProgressComponent', () => {
  let component: AdminJobsProgressComponent;
  let fixture: ComponentFixture<AdminJobsProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminJobsProgressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminJobsProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
