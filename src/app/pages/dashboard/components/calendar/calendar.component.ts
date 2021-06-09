import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { startOfDay, endOfDay } from 'date-fns';
import { Subject } from 'rxjs';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [DatePipe],
})
export class CalendarComponent implements OnInit, AfterViewInit {
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  @Input() events: CalendarEvent[] = [];

  @Output() selectedDateEvent = new EventEmitter<Date>();

  changeSelectedDate(): void {
    this.selectedDateEvent.emit(this.viewDate);
  }

  constructor(private datePipe: DatePipe) {}
  ngAfterViewInit(): void {
    this.todaySelected();
  }
  ngOnInit(): void {
    console.log('init');
  }

  dayClicked(event: any): void {
    // const date = event.day.date;
    // const fdate = this.datePipe.transform(event.day.date, 'dd/MM/yyyyTHH:mm');
    // const target = event.sourceEvent.target as HTMLElement;
    // this.viewDate = new Date(fdate?.toString());
    // document.querySelector('.selected')?.classList.remove('selected');
    // target.closest('mwl-calendar-month-cell')?.classList.add('selected');
    // this.changeSelectedDate();
  }

  todaySelected(): void {
    if (!document.querySelector('.cal-day-cell.cal-today')?.classList.contains('selected')) {
      document.querySelector('.selected')?.classList.remove('selected');
      document.querySelector('.cal-day-cell.cal-today')?.classList.add('selected');
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    // this.activeDayIsOpen = false;
  }
}
