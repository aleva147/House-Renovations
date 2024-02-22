import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAgenciesComponent } from './client-agencies.component';

describe('ClientAgenciesComponent', () => {
  let component: ClientAgenciesComponent;
  let fixture: ComponentFixture<ClientAgenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAgenciesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAgenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
