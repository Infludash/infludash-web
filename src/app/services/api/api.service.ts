import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ApiType } from './ApiType';
import { environment as env } from 'src/environments/environment';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiType: ApiType = ApiType.base;

  private url: string | undefined;
  constructor(private http: HttpClient, private token: TokenService) {}

  public getRequest(path: string, apiType: ApiType, authenticated?: boolean): any {
    const headers = new HttpHeaders().set('accept', 'application/json');
    if (authenticated) {
      headers.append('Bearer', this.token.getRefreshToken());
    }
    this.defineUrl(apiType);
    const fullUrl = this.url + path;
    return this.http.get(fullUrl, { headers }).toPromise();
  }

  public postRequest(path: string, payload: any, apiType: ApiType, authenticated?: boolean): any {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    if (authenticated) {
      headers.append('Bearer', this.token.getRefreshToken());
    }
    this.defineUrl(apiType);
    let fullUrl = this.url + path;
    if (apiType === ApiType.auth) {
      fullUrl += '/';
    }
    return this.http.post(fullUrl, payload, { headers }).toPromise();
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
}
