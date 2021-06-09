import { TestBed } from '@angular/core/testing';

import { SocialTokenService } from './social-token.service';

describe('SocialTokenService', () => {
  let service: SocialTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
