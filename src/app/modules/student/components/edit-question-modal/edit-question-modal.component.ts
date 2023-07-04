import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QAService } from '../../services/qa.service';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-edit-question-modal',
  templateUrl: './edit-question-modal.component.html',
  styleUrls: ['./edit-question-modal.component.css']
})
export class EditQuestionModalComponent {
  constructor(
    private _QAService: QAService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<EditQuestionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categoryID: any, question: string, categories: any, questionID: string }
  ) {

  }

  questionForm = new FormGroup({
    question: new FormControl(this.data.question, [Validators.required]),
    categoryID: new FormControl(this.data.categoryID?._id, [Validators.required]),
  })

  editQuestion() {
    this._QAService.editQuestion(this.data.questionID, this.questionForm.value).subscribe({
      next: (data) => {
        this._QAService.buttonClicked.emit();
        this.dialogRef.close()
      },
      error: (error: any) => {
        if (error.status === 422) {
          this.toastr.error(error.error.error)
        }
        else {
          this.toastr.error('cannot update question!')
        }
      },
    });
  }
}
