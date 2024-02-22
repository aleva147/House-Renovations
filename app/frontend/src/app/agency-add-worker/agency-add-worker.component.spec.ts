import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyAddWorkerComponent } from './agency-add-worker.component';

describe('AgencyAddWorkerComponent', () => {
  let component: AgencyAddWorkerComponent;
  let fixture: ComponentFixture<AgencyAddWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyAddWorkerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyAddWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
