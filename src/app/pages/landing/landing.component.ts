import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less'],
})
export class LandingComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    const top = document.querySelector('body').scrollTop;

    window.onscroll = function (e) {
      const current = e.target.scrollingElement.scrollTop;
      const nav = document.querySelector('nav');
      if (current <= 10) {
        if (nav.classList.contains('scrolled')) {
          nav.classList.toggle('scrolled');
        }
      } else {
        if (!nav.classList.contains('scrolled')) {
          nav.classList.toggle('scrolled');
        }
      }
    };
  }
}
