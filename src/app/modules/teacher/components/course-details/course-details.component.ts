import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from '../../services/teacher.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SessionCommentModalComponent } from '../session-comment-modal/session-comment-modal.component';
import { StudentsEnrolledModalComponent } from '../students-enrolled-modal/students-enrolled-modal.component';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
})
export class CourseDetailsComponent implements OnInit {
  id: string = '';
  course: any;
  isLoading: boolean = true;
  dialogConfig = new MatDialogConfig();
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _teacherService: TeacherService,
    private toastr: ToastrService,
    private _Router: Router,
    private dialog: MatDialog
  ) {
    this.id = this._activatedRoute.snapshot.params['id'];
    this.getCourseDetails();
    this._teacherService.sessionDetailsChange.subscribe(()=>{
      this.getCourseDetails();
    })
  }

  ngOnInit(): void { }

  getCourseDetails() {
    this._teacherService.getCourseDetails(this.id).subscribe({
      next: (data) => {        
        this.course = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        if (error.status === 404) {
          this.toastr.error(`${error.error.error}`, 'Error');
          this._Router.navigate(['/teacher/courses']);
        } else {
          this.toastr.error('Cannot get course details', 'Error');
        }
        this.isLoading = false;
      },
    });
  }
  formatDate(dateStr: string) {

    return dateStr.split('T')[0];

  }

  hasSessionEnded(session: any): boolean {
    const sessionDate = new Date(session.date.split('T')[0]);
    const sessionTime = session.endTime;
    if (sessionTime.split(':')[1]) {
      sessionDate.setHours(Number(sessionTime.split(':')[0]));
      sessionDate.setMinutes(Number(sessionTime.split(':')[1]));
    } else {
      sessionDate.setHours(Number(sessionTime));
      sessionDate.setMinutes(Number('00'));
    }
    const today = new Date()

    return (today > sessionDate);
  }
  sessionStartingSoon(session: any): boolean {
    const sessionDateEnd = new Date(session.date.split('T')[0]);
    const sessionTimeEnd = session.endTime;
    if (sessionTimeEnd.split(':')[1]) {
      sessionDateEnd.setHours(Number(sessionTimeEnd.split(':')[0]));
      sessionDateEnd.setMinutes(Number(sessionTimeEnd.split(':')[1]));
    } else {
      sessionDateEnd.setHours(Number(sessionTimeEnd));
      sessionDateEnd.setMinutes(0);
    }
    const today = new Date();
    return (today < sessionDateEnd && today.toDateString() === sessionDateEnd.toDateString())
  }

  openSessionCommentModal(session: any): void {
    this.dialogConfig.data = {
      id:session._id,
      progressComment: session.progressComment || '',
    };
    this.dialog.open(SessionCommentModalComponent, this.dialogConfig);
  }

  CommentDisplay(session:any) {
    session.viewComment = true;
  }
  CommentHide(session:any) {
    session.viewComment = false;
  }

  viewStudents(){
    this.dialogConfig.data = {
      courseID: this.course._id
    };
    this.dialog.open(StudentsEnrolledModalComponent, this.dialogConfig);
  }

}
