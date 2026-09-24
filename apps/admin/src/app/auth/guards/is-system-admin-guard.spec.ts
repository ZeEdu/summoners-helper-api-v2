import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isSystemAdminGuard } from './is-system-admin-guard';

describe('isSystemAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isSystemAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
