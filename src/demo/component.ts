import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns';
import { Observable } from 'rxjs';
import { colors } from '../demo-utils/colors';

interface Film {
  id: number;
  text: string;
  day: string;
  reminder: boolean,
  start : string
}

/* {
  "id": 1,
  "text": "Doctors Appointment",
  "day": "May 5th at 2:30pm",
  "reminder": true,
  "start" : "2021-08-11"
  
}, */



function getTimezoneOffsetString(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset();
  const hoursOffset = String(
    Math.floor(Math.abs(timezoneOffset / 60))
  ).padStart(2, '0');
  const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, '0');
  const direction = timezoneOffset > 0 ? '-' : '+';

  return `T00:00:00${direction}${hoursOffset}:${minutesOffset}`;
}

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'template.html',
})
export class DemoComponent implements OnInit {
  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events$: Observable<CalendarEvent<{ film: Film; }>[]> | undefined;

  activeDayIsOpen: boolean = false;

  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view];

    

    this.events$ = this.http
      .get('http://localhost:5000/events')
      .pipe(
        map((res: any) => {

          console.log(res)
          return res.map((film: Film) => {
            return {
              title: film.text,
              start: new Date(
                film.start
              ),
              color: colors.yellow,
              allDay: true,
              draggable: true,
              meta: {
                film,
              },
            };
          });
        })
      );
  }

  dayClicked({date,events,}: {date: Date;events: CalendarEvent<{ film: Film }>[];}): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventClicked(event: CalendarEvent<{ film: Film }>): void {
    /* window.open(
      `https://www.themoviedb.org/movie/${event.meta.film.id}`,
      '_blank'
    ); */
  }
}
