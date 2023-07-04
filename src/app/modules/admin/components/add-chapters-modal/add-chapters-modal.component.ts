import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RecordedCoursesService } from '../../services/recorded-courses.service';
import { ChaptersService } from '../../services/chapters.service';

@Component({
  selector: 'app-add-chapters-modal',
  templateUrl: './add-chapters-modal.component.html',
  styleUrls: ['./add-chapters-modal.component.css']
})
export class AddChaptersModalComponent implements OnInit {
  chaptersForm: FormGroup;
  numberOfChapters: number = 0;
  recordedCourseId: string = '';

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private recordedCourse: RecordedCoursesService,
    private chapter: ChaptersService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { recordedCourseId: string }
    ) {

    this.chaptersForm = this.fb.group({
      chapters: this.fb.array([])
    });
    this.chaptersForm.setControl('numberOfChapters', this.fb.control(this.numberOfChapters, [Validators.required, Validators.min(1)]));
  }

  get chapters() {
    return this.chaptersForm.get('chapters') as FormArray;
  }

  createChapter() {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3) , this.trimValidator]],
      description: ['', [Validators.required, Validators.minLength(10), this.trimValidator]],
      media: ['', [Validators.required, this.trimValidator]]
    });
  }

  onSubmit() {
    this.chapter.addNewChapters(this.chaptersForm.value.chapters, this.recordedCourseId).subscribe({
      next: () => {
        this.recordedCourse.buttonClicked.emit();
        this.dialog.closeAll();
      },
      error: (error : any) => {
        let {error : {message}}  = error;
        if(!message) message = error.error.error;
        this.toastr.error(`${message}`,'Error');
      }
    })
  }

  setNumberOfChapters(num: number) {
    this.chapters.clear();
    for (let i = 0; i < num; i++) {
      this.chapters.push(this.createChapter());
    }
  }

  trimValidator(control: any) {
    const value = control.value as string;
    const isWhitespace = value.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  ngOnInit(): void {
    this.recordedCourseId = this.data.recordedCourseId;
  }
}
