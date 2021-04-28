import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { DashComponent } from './dash/dash.component';
import { BrowserModule } from '@angular/platform-browser';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [DashboardComponent, DashComponent, NotFoundComponent],
  imports: [BrowserModule, DashboardRoutingModule, AngularMaterialModule, LayoutModule],
  providers: [],
  bootstrap: [DashboardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
