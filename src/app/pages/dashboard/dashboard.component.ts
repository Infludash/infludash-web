import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ModeService } from 'src/app/services/mode/mode.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  get page(): string {
    return this.router.url.replace('/app/', '');
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public modeService: ModeService,
    public toast: ToastService
  ) {}
  slideToggleChecked = false;

  menuItems = [
    { icon: 'dashboard', name: 'dashboard' },
    { icon: 'share', name: 'social-channels' },
    { icon: 'post_add', name: 'posts' },
    { icon: 'today', name: 'calendar' },
    { icon: 'trending_up', name: 'analytics' },
    { icon: 'tune', name: 'preferences' },
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  public username: string | null = localStorage.getItem('username');
  ngOnInit(): void {
    this.modeService.setModeToBody();
  }

  toggleMode(): void {
    document.querySelector('.mode-toggle')?.classList.toggle('rotated');

    this.modeService.toggleMode();
  }
}
