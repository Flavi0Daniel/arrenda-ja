import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { arrendatarioGuard } from './arrendatario.guard';

describe('arrendatarioGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => arrendatarioGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
