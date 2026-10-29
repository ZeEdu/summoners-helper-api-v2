import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isNotSignedInGuard } from './is-not-signed-in-guard';

describe('isNotSignedInGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isNotSignedInGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
