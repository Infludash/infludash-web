import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiType } from './ApiType';

@Injectable({
  providedIn: 'root',
})
export class SocialService {
  constructor(private api: ApiService) {}

  async checkAndGetAccessToken(): Promise<any> {
    const response = await this.api.apiRequest(
      'get',
      `socials/youtube/${localStorage.getItem('email')}`,
      ApiType.base,
      true
    );
    return response.accessToken;
  }
}
