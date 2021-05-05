import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { DashComponent } from './dash/dash.component';
import { BrowserModule } from '@angular/platform-browser';
import { NotFoundComponent } from './not-found/not-found.component';
import { SocialChannelsComponent } from './social-channels/social-channels.component';
import { environment as env } from 'src/environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  SocialLoginModule,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { WidgetComponent } from './components/widget/widget.component';
import { AddChannelDialogComponent } from './components/add-channel-dialog/add-channel-dialog.component';
@NgModule({
  declarations: [DashboardComponent, DashComponent, NotFoundComponent, SocialChannelsComponent, WidgetComponent, AddChannelDialogComponent],
  imports: [
    BrowserModule,
    DashboardRoutingModule,
    AngularMaterialModule,
    LayoutModule,
    SocialLoginModule,
    FontAwesomeModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(env.googleClient),
          },
          // {
          //   id: FacebookLoginProvider.PROVIDER_ID,
          //   provider: new FacebookLoginProvider('clientId'),
          // },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [DashboardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
