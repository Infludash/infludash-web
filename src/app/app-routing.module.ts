import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { EmailConfirmComponent } from './pages/auth/email-confirm/email-confirm.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LandingComponent } from './pages/landing/landing.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

const routes: Routes = [
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
  {
    path: 'email-confirm',
    canActivate: [AuthGuard],
    data: { requiresPartlyLoggedIn: true },
    component: EmailConfirmComponent,
  },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [AuthGuard],
    data: { requiresLoggedOut: true },
  },
  { path: '', component: LandingComponent },
  {
    path: 'app',
    canActivate: [AuthGuard],
    data: { requiresLoggedIn: true },
    loadChildren: () =>
      import('./pages/dashboard/dashboard-routing.module').then((m) => m.DashboardRoutingModule),
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
