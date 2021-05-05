import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ApiType } from './ApiType';
import { environment as env } from 'src/environments/environment';
import { TokenService } from '../token/token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiType: ApiType = ApiType.base;

  private url: string | undefined;
  constructor(private http: HttpClient, private token: TokenService, private router: Router) {}

  public async apiRequest(
    type: string,
    path: string,
    apiType: ApiType,
    authenticated?: boolean,
    payload?: any,
    user: boolean = true
  ): Promise<any> {
    if (authenticated === true && user === true) {
      console.log('authenticated user');
      //  check access token is valid
      const accessTokenIsValid: boolean = await this.checkValidToken(this.token.getToken());

      if (accessTokenIsValid === false) {
        // access token invalid
        console.log('access token invalid');
        // check refresh token is valid
        const refreshTokenIsValid: boolean = await this.checkValidToken(
          this.token.getRefreshToken()
        );
        if (refreshTokenIsValid === false) {
          // refresh token invalid
          console.log('refresh token invalid');
          // logout
          this.router.navigate(['/logout']);
        } else {
          // refresh token is valid -> ask new access token
          const tokenRefreshed = await this.refreshToken();
        }
      }
    }
    let headers = new HttpHeaders();
    if (type === 'get') {
      headers = headers.append('accept', 'application/json');
    } else if (type === 'post') {
      headers = headers.append('content-type', 'application/json');
    }
    if (authenticated === true) {
      console.log('authenticated request');

      headers = headers.append('Authorization', `Bearer ${this.token.getToken()}`);
    }
    this.defineUrl(apiType);
    let fullUrl = this.url + path;
    if (apiType === ApiType.auth) {
      fullUrl += '/';
    }
    if (type === 'get') {
      return this.http.get(fullUrl, { headers }).toPromise();
    } else if (type === 'post') {
      return this.http.post(fullUrl, payload, { headers }).toPromise();
    }
  }

  private defineUrl(apiType: ApiType): void {
    switch (apiType) {
      case ApiType.base:
        this.url = env.apiUrl;
        break;
      case ApiType.auth:
        this.url = env.authUrl;
        break;
      default:
        this.url = env.apiUrl;
        break;
    }
  }

  private async checkValidToken(token: string): Promise<boolean> {
    try {
      const resp = await this.apiRequest(
        'post',
        'token/verify',
        ApiType.auth,
        false,
        {
          token,
        },
        false
      );
      if (Object.keys(resp).length === 0) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      const resp = await this.apiRequest(
        'post',
        'token/refresh',
        ApiType.auth,
        false,
        { refresh: this.token.getRefreshToken() },
        false
      );
      this.token.saveToken(resp.access);
    } catch (error) {
      console.log(error);
    }
  }
}
