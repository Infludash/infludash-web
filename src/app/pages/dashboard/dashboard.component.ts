import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ModeService } from 'src/app/services/mode/mode.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  mode = this.modeService.getMode();
  slideToggleChecked = false;
  get page(): string {
    return this.router.url.replace('/app/', '');
  }

  menuItems = [
    { icon: 'dashboard', name: 'dashboard' },
    { icon: 'trending_up', name: 'analytics' },
    { icon: 'event', name: 'post' },
    { icon: 'settings', name: 'settings' },
    { icon: 'share', name: 'social-channels' },
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private modeService: ModeService
  ) {}
  ngOnInit(): void {}

  toggleMode(event: Event): void {
    document.querySelector('.mode-toggle')?.classList.toggle('rotated');

    this.modeService.toggleMode();
  }
}
