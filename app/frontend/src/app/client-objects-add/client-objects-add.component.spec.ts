import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientObjectsAddComponent } from './client-objects-add.component';

describe('ClientObjectsAddComponent', () => {
  let component: ClientObjectsAddComponent;
  let fixture: ComponentFixture<ClientObjectsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientObjectsAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientObjectsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
