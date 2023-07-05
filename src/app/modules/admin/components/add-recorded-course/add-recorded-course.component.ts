import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecordedCourseCategoryService } from '../../services/recorded-course-category.service';
import { categoryElement } from '../list-recorded-course/list-recorded-course.component';
import { ToastrService } from 'ngx-toastr';
import { RecordedCoursesService } from '../../services/recorded-courses.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-recorded-course',
  templateUrl: './add-recorded-course.component.html',
  styleUrls: ['./add-recorded-course.component.css']
})
export class AddRecordedCourseComponent implements OnInit{

  recordedCourseForm: FormGroup;
  categories : categoryElement[] = [];
  selectedCategoryName : string = '';

  constructor(private fb: FormBuilder, private toastr: ToastrService, private category: RecordedCourseCategoryService, private recordedCourse: RecordedCoursesService, public dialog: MatDialog) {
    this.recordedCourseForm = this.fb.group({
      name: ['', [Validators.required, , this.trimValidator]],
      price: ['', [Validators.required, this.trimValidator, this.greaterThanZeroValidator]],
      category: ['', [Validators.required, , this.trimValidator]],
    });
    this.getCategories();
  }



  trimValidator(control: any) {
    const value = control.value as string;
    const isWhitespace = value.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  greaterThanZeroValidator(control: any) {
    return control.value >= 0 ? null : { notGreaterThanZero: true };
  }

  getCategories(): void {
    let params = {
      type: 'recordedCourse'
    }
    this.category.getRecordedCourseCategoriesNotPaginated(params).subscribe({

      next: (data) => {
        this.categories = data;
      },
      error : (error : any) => {
        let {error : {message}}  = error;
        if(!message) message = error.error.error;
        this.toastr.error(`${message}`,'Error');
      }
    })
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.recordedCourse.addRecordedCourse(this.recordedCourseForm.value).subscribe({
      next: () => {
        this.recordedCourse.buttonClicked.emit();
        this.dialog.closeAll();
      },
      error : (error : any) => {
        let {error : {message}}  = error;
        if(!message) message = error.error.error;
        this.toastr.error(`${message}`,'Error');
      }
    })
  }
}
