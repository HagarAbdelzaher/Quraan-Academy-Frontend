import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from '../../services/teacher.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-enrolledstudent',
  templateUrl: './enrolledstudent.component.html',
  styleUrls: ['./enrolledstudent.component.css']
})
export class EnrolledstudentComponent {
  @Input() student: any;
  constructor(private _teacherService:TeacherService, private toastr: ToastrService) { }

  commentForm = new FormGroup({
    comment: new FormControl('', [Validators.minLength(5)]),
    studentId: new FormControl()
  })
  onSubmit(id:string) {
    this.commentForm.value.studentId = this.student.studentId._id
    this._teacherService.addStudentComment(id, this.commentForm.value).subscribe({
      next:(res)=>{
        this.toastr.success('Comment added successfully','Success')
        this._teacherService.commentAdded.emit()
      },
      error:(err)=>{
        this.toastr.error('Couldnt add comment','Error')
      }
    })
    const commentValue = this.commentForm.get('comment')?.value;
  }
}
