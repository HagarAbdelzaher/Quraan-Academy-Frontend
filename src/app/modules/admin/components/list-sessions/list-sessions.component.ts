import { Component } from '@angular/core';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-list-sessions',
  templateUrl: './list-sessions.component.html',
  styleUrls: ['./list-sessions.component.css'],
})
export class ListSessionsComponent {
  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  sessions: sessionElement[] = [];
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  date: string = `${this.selectedYear}-${this.selectedMonth}-01`;
  firstDay: number = new Date(this.date).getDay();
  daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  currentYear: number = new Date().getFullYear();
  years: number[] = Array.from({ length: 11 }, (_, i) => {
    return this.currentYear + i;
  });
  constructor(private session: SessionService) {
    this.session.buttonClicked.subscribe(() => {
      this.getSessions();
    });
  }

  getSessions(): void {
    const params = {
      month: this.selectedMonth,
      year: this.selectedYear,
    };
    this.date = `${this.selectedYear}-${this.selectedMonth}-01`;
    this.firstDay = new Date(this.date).getDay();
    this.session.getSessions(params).subscribe({
      next: (data: any) => {
        this.sessions = data.map((session: any, index: number) => ({
          ...session,
          id: index + 1,
          date: new Date(session.date.split('T')[0]),
          showBubble: false,
        }));
      },
    });
  }
  showBubble(session: sessionElement) {
    session.showBubble = !session.showBubble;
  }
  getMonthName(monthNumber: number): string {
    const date = new Date(2000, monthNumber, 1);

    // Use the toLocaleString() method to get the month name
    const monthName = date.toLocaleString('default', { month: 'long' });
    return monthName;
  }
  ngOnInit(): void {
    this.getSessions();
  }
}
export interface sessionElement {
  id?: number;
  _id?: string;
  courseID: {
    name: string;
  };
  date: Date;
  startTime: string;
  endTime: string;
  progressComment: string;
  showBubble: boolean;
}
