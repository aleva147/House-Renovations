import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddWorkerComponent } from './admin-add-worker.component';

describe('AdminAddWorkerComponent', () => {
  let component: AdminAddWorkerComponent;
  let fixture: ComponentFixture<AdminAddWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAddWorkerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
