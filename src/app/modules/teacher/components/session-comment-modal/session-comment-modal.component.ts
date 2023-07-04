import { Component, Inject } from '@angular/core';
import { TeacherService } from '../../services/teacher.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-session-comment-modal',
  templateUrl: './session-comment-modal.component.html',
  styleUrls: ['./session-comment-modal.component.css']
})
export class SessionCommentModalComponent {

  constructor(private _teacherService: TeacherService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<SessionCommentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { progressComment: any, id: string }
  ) { }
  commentForm = new FormGroup({
    comment: new FormControl(this.data.progressComment, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
  })
  setSessionComment(sessionID: string) {

    this._teacherService.addProgressComment(sessionID, this.commentForm.value.comment).subscribe({
      next: (data) => {
        this.toastr.success(`Comment added Successfully`, 'Success');
        this._teacherService.sessionDetailsChange.emit();
        this.dialogRef.close()
      },
      error: (error: any) => {
        if (error.status === 404 || error.status === 401) {
          this.toastr.error(`${error.error.error}`, 'Error');
        } else {
          this.toastr.error('Cannot add comment', 'Error');
        }
      },
    });
  }
}
