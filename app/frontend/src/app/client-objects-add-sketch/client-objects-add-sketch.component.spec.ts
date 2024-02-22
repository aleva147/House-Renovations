import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientObjectsAddSketchComponent } from './client-objects-add-sketch.component';

describe('ClientObjectsAddSketchComponent', () => {
  let component: ClientObjectsAddSketchComponent;
  let fixture: ComponentFixture<ClientObjectsAddSketchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientObjectsAddSketchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientObjectsAddSketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
