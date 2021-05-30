import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { LandingComponent } from './pages/landing/landing.component';
import { AuthModule } from './pages/auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LayoutModule } from '@angular/cdk/layout';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [AppComponent, LandingComponent, NotFoundComponent, PrivacyPolicyComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    AuthModule,
    HttpClientModule,
    LayoutModule,
    DashboardModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
