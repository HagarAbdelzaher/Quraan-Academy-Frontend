import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { QAService } from '../../services/qa.service';

@Component({
  selector: 'app-edit-answer-modal',
  templateUrl: './edit-answer-modal.component.html',
  styleUrls: ['./edit-answer-modal.component.css']
})
export class EditAnswerModalComponent {
  constructor(
    private _QAService: QAService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<EditAnswerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { answer:string, questionID:string}
  ) {

  }

  answerForm = new FormGroup({
    answer: new FormControl(this.data.answer, [Validators.required]),
  })

  editAnswer() {
    this._QAService.editAnswer(this.data.questionID, this.answerForm.value).subscribe({
      next: (data) => {
        this._QAService.buttonClicked.emit();
        this.dialogRef.close()
      },
      error: (error: any) => {
        if (error.status === 422) {
          this.toastr.error(error.error.error)
        }
        else {
          this.toastr.error('cannot update answer!')
        }
      },
    });
  }
}
