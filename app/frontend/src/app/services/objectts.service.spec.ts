import { TestBed } from '@angular/core/testing';

import { ObjecttsService } from './objectts.service';

describe('ObjecttsService', () => {
  let service: ObjecttsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjecttsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
