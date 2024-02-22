import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientObjectsEditObjectComponent } from './client-objects-edit-object.component';

describe('ClientObjectsEditObjectComponent', () => {
  let component: ClientObjectsEditObjectComponent;
  let fixture: ComponentFixture<ClientObjectsEditObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientObjectsEditObjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientObjectsEditObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
