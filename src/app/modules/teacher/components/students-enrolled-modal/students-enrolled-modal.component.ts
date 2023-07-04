import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeacherService } from '../../services/teacher.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-students-enrolled-modal',
  templateUrl: './students-enrolled-modal.component.html',
  styleUrls: ['./students-enrolled-modal.component.css']
})
export class StudentsEnrolledModalComponent implements OnInit {
  students:any;
  isLoading = true;
  constructor(
    private _teacherService: TeacherService,
    private toastr:ToastrService,
    private dialogRef: MatDialogRef<StudentsEnrolledModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courseID: string }
  ) { }
  ngOnInit(): void {
    this.getEnrolledStudents()
    this._teacherService.commentAdded.subscribe(()=>{
    this.getEnrolledStudents()
    })
  }

  getEnrolledStudents(){
    this.isLoading=true
    this._teacherService.getEnrolledStudents(this.data.courseID).subscribe({
      next: (res)=>{
        this.students = res;
        this.isLoading = false;
      },
      error: (err)=>{
        this.toastr.error('Cannot view students', 'Error');
        this.isLoading = false;
      }
    })

  }
}
