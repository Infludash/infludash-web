import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { EmailConfirmComponent } from './pages/auth/email-confirm/email-confirm.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LandingComponent } from './pages/landing/landing.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    data: { requiresLoggedIn: true },
    component: DashboardComponent,
  },
  {
    path: 'login',
    canActivate: [AuthGuard],
    data: { requiresLoggedOut: true },
    component: LoginComponent,
  },
  {
    path: 'register',
    canActivate: [AuthGuard],
    data: { requiresLoggedOut: true },
    component: RegisterComponent,
  },
  {
    path: 'logout',
    canActivate: [AuthGuard],
    data: { requiresLoggedIn: true },
    component: LogoutComponent,
  },
  { path: 'email-confirm', component: EmailConfirmComponent },
  { path: '', component: LandingComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
