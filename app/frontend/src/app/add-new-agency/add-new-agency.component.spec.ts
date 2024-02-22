import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAgencyComponent } from './add-new-agency.component';

describe('AddNewAgencyComponent', () => {
  let component: AddNewAgencyComponent;
  let fixture: ComponentFixture<AddNewAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewAgencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
