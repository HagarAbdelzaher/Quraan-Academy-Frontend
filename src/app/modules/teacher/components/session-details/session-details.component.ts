import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from '../../services/teacher.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css']
})
export class SessionDetailsComponent {
  id: string = '';
  session: any;
  isLoading: boolean = true;
  sessionNum: number = 0;

  constructor(private _activatedRoute: ActivatedRoute,
    private _teacherService: TeacherService,
    private toastr: ToastrService,
    private _Router: Router) {
    this.id = this._activatedRoute.snapshot.params['id'];
    this.getSessionDetails();
  }

  ngOnInit(): void {
    this._activatedRoute.queryParamMap.subscribe(params => {
      const sessionNum: any = params.get('sessionNum');
      this.sessionNum = sessionNum
    });
  }

  getSessionDetails() {
    this._teacherService.getSessionDetails(this.id).subscribe({
      next: (data) => {
        this.session = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        if (error.status === 404) {
          this.toastr.error(`${error.error.error}`, "Error");
          this._Router.navigate(['/teacher/courses'])
        }
        else {
          this.toastr.error('Cannot get session details', "Error");
        }
        this.isLoading = false
      },
    })
  }

  createMeeting() {
    //now>start and now<end
    const sessionDateStart = new Date(this.session.date.split('T')[0]);
    const sessionDateEnd = new Date(this.session.date.split('T')[0]);
    const sessionStart = this.session.startTime;
    const sessionEnd = this.session.endTime;
    sessionDateStart.setHours(Number(sessionStart.split(':')[0]));
    sessionDateStart.setMinutes(Number(sessionStart.split(':')[1]));
    sessionDateEnd.setHours(Number(sessionEnd.split(':')[0]));
    sessionDateEnd.setMinutes(Number(sessionEnd.split(':')[1]));

    if (sessionDateStart > new Date()) {
      this.toastr.error('Session not available yet', "Error");
    } else if (sessionDateEnd < new Date()) {
      console.log(sessionDateEnd);
      
      this.toastr.error('Session already ended', "Error");
    } else {
      this._teacherService.createMeeting(this.id).subscribe(
        {
          next: (data) => {
            this.session.startUrl = data.startUrl;
            this.session.joinUrl = data.joinUrl;
            this.toastr.success('meeting link generated', "Success");
          },
          error: (error: any) => {
            this.toastr.error('Cannot generate meeting link', "Error");
          },
        }
      )
    }
  }
  formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const formattedDate = new Intl.DateTimeFormat("en-GB").format(date);
    return formattedDate;

  }
}
