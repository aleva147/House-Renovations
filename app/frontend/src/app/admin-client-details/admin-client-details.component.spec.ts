import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClientDetailsComponent } from './admin-client-details.component';

describe('AdminClientDetailsComponent', () => {
  let component: AdminClientDetailsComponent;
  let fixture: ComponentFixture<AdminClientDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminClientDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminClientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
