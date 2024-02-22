import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientJobsProgressComponent } from './client-jobs-progress.component';

describe('ClientJobsProgressComponent', () => {
  let component: ClientJobsProgressComponent;
  let fixture: ComponentFixture<ClientJobsProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientJobsProgressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientJobsProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
