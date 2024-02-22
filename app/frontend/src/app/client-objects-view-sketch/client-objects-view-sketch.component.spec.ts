import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientObjectsViewSketchComponent } from './client-objects-view-sketch.component';

describe('ClientObjectsViewSketchComponent', () => {
  let component: ClientObjectsViewSketchComponent;
  let fixture: ComponentFixture<ClientObjectsViewSketchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientObjectsViewSketchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientObjectsViewSketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
