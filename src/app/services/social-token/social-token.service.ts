import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SocialTokenService {
  constructor() {}

  // get valid social access token
  async getValidSocialAccessToken(): Promise<void> {}
}
