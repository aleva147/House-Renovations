import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientObjectsComponent } from './client-objects.component';

describe('ClientObjectsComponent', () => {
  let component: ClientObjectsComponent;
  let fixture: ComponentFixture<ClientObjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientObjectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientObjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
