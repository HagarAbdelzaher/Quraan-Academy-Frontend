import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { QAService } from '../../services/qa.service';

@Component({
  selector: 'app-ask-question-modal',
  templateUrl: './ask-question-modal.component.html',
  styleUrls: ['./ask-question-modal.component.css']
})
export class AskQuestionModalComponent {

  constructor(
    private _QAService: QAService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AskQuestionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: any }
  ) {

  }

  questionForm = new FormGroup({
    question: new FormControl(null, [Validators.required]),
    categoryID: new FormControl(null, [Validators.required]),
  })

  askQuestion() {
    this._QAService.askQuestion(this.questionForm.value).subscribe({
      next: (data) => {
        this._QAService.buttonClicked.emit();
        this.dialogRef.close()
      },
      error: (error: any) => {
        if (error.status === 422) {
          this.toastr.error(error.error.error)
        }
        else {
          this.toastr.error('cannot add question!')
        }
      },
    });
  }
}
