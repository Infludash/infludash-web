import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ApiType } from './ApiType';
import { environment as env } from 'src/environments/environment';
import { TokenService } from '../token/token.service';
import { Router } from '@angular/router';

export interface InfluHeader {
  key: string;
  value: string;
}

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
    user: boolean = true,
    customHeaders?: InfluHeader[]
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
    if (type === 'get' || type === 'delete') {
      headers = headers.append('accept', 'application/json');
    } else if (type === 'post' || type === 'patch') {
      headers = headers.append('content-type', 'application/json');
    } else if (type === 'file-post') {
      headers = headers.append('content-type', 'multipart/form-data');
    }

    if (customHeaders) {
      for (const header of customHeaders) {
        headers = headers.append(header.key, header.value);
      }
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
    } else if (type === 'post' || type === 'file-post') {
      return this.http.post(fullUrl, payload, { headers }).toPromise();
    } else if (type === 'delete') {
      return this.http.delete(fullUrl, { headers }).toPromise();
    } else if (type === 'patch') {
      return this.http.patch(fullUrl, payload, { headers }).toPromise();
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

  public async checkValidToken(token: string): Promise<boolean> {
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
