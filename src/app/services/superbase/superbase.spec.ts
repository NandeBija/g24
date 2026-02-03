import { TestBed } from '@angular/core/testing';

import { Superbase } from './superbase';

describe('Superbase', () => {
  let service: Superbase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Superbase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
