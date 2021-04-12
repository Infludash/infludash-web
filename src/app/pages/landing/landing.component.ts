import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  constructor() {}

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
  }
}
