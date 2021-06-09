import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashComponent } from './dash/dash.component';
import { DashboardComponent } from './dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PostsCalendarComponent } from './posts-calendar/posts-calendar.component';
import { PostsComponent } from './posts/posts.component';
import { ProfileComponent } from './profile/profile.component';
import { SocialChannelsComponent } from './social-channels/social-channels.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'dashboard', component: DashComponent },
      { path: 'social-channels', component: SocialChannelsComponent },
      { path: 'posts', component: PostsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'calendar', component: PostsCalendarComponent },
      { path: '**', component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
