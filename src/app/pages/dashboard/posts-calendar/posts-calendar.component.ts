import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiType } from 'src/app/services/api/ApiType';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DeletePostDialogComponent } from '../components/delete-post-dialog/delete-post-dialog.component';

@Component({
  templateUrl: './posts-calendar.component.html',
  styleUrls: ['./posts-calendar.component.scss'],
})
export class PostsCalendarComponent implements OnInit {
  calendarEvents: CalendarEvent[] = [];
  futurePosts: any[] = [];
  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private toast: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    this.calendarEvents = await this.getCalendarEvents();
    this.futurePosts = await this.getFuturePosts();
  }

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    const dbEvents = await this.apiService.apiRequest('post', 'posts', ApiType.base, true, {
      userEmail: localStorage.getItem('email'),
    });
    const calendarEvents: CalendarEvent[] = [];
    for (const event of dbEvents) {
      if (event.type === 3) {
        calendarEvents.push({
          start: startOfDay(new Date(event.scheduled)),
          title: event.title,
          color: { primary: '#FF0000', secondary: '#282828' },
        });
      } else if (event.type === 0) {
        calendarEvents.push({
          start: startOfDay(new Date(event.scheduled)),
          title: event.title,
          color: { primary: '#4267B2', secondary: '#898F9C' },
        });
      }
    }

    return calendarEvents;
  }

  async getFuturePosts(): Promise<any> {
    const posts = await this.apiService.apiRequest('post', 'posts/future', ApiType.base, true, {
      userEmail: localStorage.getItem('email'),
    });

    return posts;
  }

  async deletePost(id: number): Promise<void> {
    const dialogRef = this.dialog.open(DeletePostDialogComponent);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'Deleted') {
        const response = await this.apiService.apiRequest(
          'delete',
          `posts/${id}`,
          ApiType.base,
          true
        );

        this.toast.addToast('Post deleted successfully!');
        this.ngOnInit();
      }
    });
  }
}
