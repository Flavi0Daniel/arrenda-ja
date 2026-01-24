import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { proprietarioGuard } from './proprietario.guard';

describe('proprietarioGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => proprietarioGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
