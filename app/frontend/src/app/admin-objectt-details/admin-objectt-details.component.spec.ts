import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminObjecttDetailsComponent } from './admin-objectt-details.component';

describe('AdminObjecttDetailsComponent', () => {
  let component: AdminObjecttDetailsComponent;
  let fixture: ComponentFixture<AdminObjecttDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminObjecttDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminObjecttDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
