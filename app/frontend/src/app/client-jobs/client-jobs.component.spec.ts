import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientJobsComponent } from './client-jobs.component';

describe('ClientJobsComponent', () => {
  let component: ClientJobsComponent;
  let fixture: ComponentFixture<ClientJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientJobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
