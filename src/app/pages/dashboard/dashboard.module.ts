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
import { PostsComponent } from './posts/posts.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './components/calendar/calendar.component';
import { DeleteChannelDialogComponent } from './components/delete-channel-dialog/delete-channel-dialog.component';
import { ToastComponent } from './components/toast/toast.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    DashboardComponent,
    DashComponent,
    NotFoundComponent,
    SocialChannelsComponent,
    WidgetComponent,
    AddChannelDialogComponent,
    PostsComponent,
    CalendarComponent,
    DeleteChannelDialogComponent,
    ToastComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    DashboardRoutingModule,
    AngularMaterialModule,
    LayoutModule,
    SocialLoginModule,
    FontAwesomeModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FormsModule,
    ReactiveFormsModule,
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
