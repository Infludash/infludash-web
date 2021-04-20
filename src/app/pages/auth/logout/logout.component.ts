import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiType } from 'src/app/services/api/ApiType';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  loggedIn = true;
  constructor(private api: ApiService, private token: TokenService, private router: Router) {}

  ngOnInit(): void {
    this.logout();
  }

  async logout(): Promise<void> {
    const resp = await this.api.postRequest('logout', {}, ApiType.auth);
    console.log(resp);
    if (resp.detail === 'Successfully logged out.') {
      this.token.removeToken();
      this.token.removeRefreshToken();
      this.loggedIn = false;
      this.router.navigate(['/login']);
    }
  }
}
