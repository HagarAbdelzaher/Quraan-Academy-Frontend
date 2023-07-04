import { Component, OnInit, Inject } from '@angular/core';
import { TeacherService } from '../../services/teacher.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-edit-teacher-modal',
  templateUrl: './edit-teacher-modal.component.html',
  styleUrls: ['./edit-teacher-modal.component.css'],
})
export class EditTeacherModalComponent {
  teacherForm: FormGroup;
  teacherId: string = '';
  teacherInstance: any;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private teacher: TeacherService,
    private dialogRef: MatDialogRef<EditTeacherModalComponent>,

    @Inject(MAT_DIALOG_DATA) public data: { teacherId: string }
  ) {
    this.teacher.getTeacher(this.teacherId).subscribe({
      next: (data) => {
        this.teacherInstance = data;
      },
    });
    this.teacherForm = this.fb.group({
      firstName: ['', [this.trimValidator]],
      lastName: ['', [this.trimValidator]],
      DOB: [''],
      gender: ['', [this.trimValidator, this.genderValidator]],
      password: ['', [Validators.minLength(9)]],
      email: ['', [this.trimValidator, Validators.email]],
    });
  }

  trimValidator(control: any) {
    const value = control.value as string;
    const isWhitespace = value.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  genderValidator(control: any) {
    const genderInput = control.value as string;

    if (!genderInput) {
      return { required: true };
    }

    if (genderInput !== 'Female' && genderInput !== 'Male') {
      return { invalidGender: true };
    }
    return null;
  }
  ngOnInit(): void {
    this.teacherId = this.data.teacherId;
    this.teacher.getTeacher(this.teacherId).subscribe({
      next: (data) => {
        this.teacherForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          DOB: data.DOB,
          gender: data.gender,
          password: data.password,
          email: data.email,
        });
      },
      error: (error: any) => {
        let {
          error: { message },
        } = error;
        if (!message) message = error.error.error;
        this.toastr.error(`${message}`, "Error");
      },
    });
  }
  onUpdate() {
    this.teacher
      .updateTeacher(this.teacherId, this.teacherForm.value)
      .subscribe({
        next: () => {
          this.teacher.buttonClicked.emit();
          this.toastr.success(`Teacher  updated successfully`, 'Success');
          this.dialogRef.close();
        },
        error: (error) => {
          let {
            error: { message },
          } = error;
          if (!message) message = error.message;

          if (error.status === 400) {
            this.toastr.error('Can not update teacher', 'Error');
          } else {
            this.toastr.error(
              'Can not update teacher now',
              'Error'
            );
          }
        },
      });
  }
}
