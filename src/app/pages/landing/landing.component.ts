import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  constructor(private api: ApiService, private token: TokenService) {}

  loggedIn = false;

  ngOnInit(): void {
    window.onscroll = (e: any) => {
      const current = e.target.scrollingElement.scrollTop;
      const nav = document.querySelector('nav');
      if (nav != null) {
        if (current <= 10) {
          if (nav.classList.contains('scrolled')) {
            nav.classList.toggle('scrolled');
          }
        } else {
          if (!nav.classList.contains('scrolled')) {
            nav.classList.toggle('scrolled');
          }
        }
      }
    };
    this.checkLoggedIn();
  }

  async checkLoggedIn(): Promise<void> {
    if (await this.api.checkValidToken(this.token.getRefreshToken())) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }
}
