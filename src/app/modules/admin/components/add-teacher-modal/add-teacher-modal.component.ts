import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeacherService } from '../../services/teacher.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-teacher-modal',
  templateUrl: './add-teacher-modal.component.html',
  styleUrls: ['./add-teacher-modal.component.css'],
})
export class AddTeacherModalComponent {
  teacherForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private teacher: TeacherService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.teacherForm = this.fb.group({
      firstName: ['', [Validators.required, this.trimValidator]],
      lastName: ['', [Validators.required, this.trimValidator]],
      DOB: ['', [Validators.required]],
      gender: [
        '',
        [Validators.required, this.trimValidator, this.genderValidator],
      ],
      password: [
        '',
        [Validators.required, this.trimValidator, Validators.minLength(9)],
      ],
      email: ['', [Validators.required, this.trimValidator, Validators.email]],
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

  onSubmit() {
    this.teacher.addNewTeacher(this.teacherForm.value).subscribe({
      next: () => {
        this.teacher.buttonClicked.emit();
        this.dialog.closeAll();
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
  ngOnInit(): void {}
}
