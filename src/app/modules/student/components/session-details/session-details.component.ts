import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css']
})
export class SessionDetailsComponent {
  id: string = '';
  session: any;
  isLoading: boolean = true;
  sessionNum:number=0;

  constructor(private _activatedRoute: ActivatedRoute,
    private _studentService: StudentService,
    private toastr: ToastrService,
    private _Router: Router) {
    this.id = this._activatedRoute.snapshot.params['id'];
    this.getSessionDetails();
  }

  ngOnInit(): void {
    this._activatedRoute.queryParamMap.subscribe(params => {
      const sessionNum:any = params.get('sessionNum');
      this.sessionNum = sessionNum
    });
  }

  getSessionDetails() {
    this._studentService.getSessionDetails(this.id).subscribe({
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

  formatDate(dateStr:string){
    const date = new Date(dateStr);
    const formattedDate = new Intl.DateTimeFormat("en-GB").format(date);
    return formattedDate;

  }
}
