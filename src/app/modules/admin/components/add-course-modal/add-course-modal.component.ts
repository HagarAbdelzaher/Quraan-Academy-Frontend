import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TeacherService } from '../../services/teacher.service';
import { teacherElement } from '../list-teachers/list-teachers.component';

@Component({
  selector: 'app-add-course-modal',
  templateUrl: './add-course-modal.component.html',
  styleUrls: ['./add-course-modal.component.css'],
})
export class AddCourseModalComponent implements OnInit {
  courseForm: FormGroup;
  teachers: teacherElement[] = [];

  constructor(
    private fb: FormBuilder,
    private course: CourseService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private teacher: TeacherService
  ) {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, this.trimValidator]],
      level: ['', [Validators.required, this.levelValidator]],
      description: [
        '',
        [Validators.required, this.trimValidator, Validators.minLength(10)],
      ],
      numberOfSessions: ['', [Validators.required]],
      price: [
        '',
        [
          Validators.required,
          this.trimValidator,
          this.greaterThanZeroValidator,
        ],
      ],
      startDate: ['', [Validators.required, this.startDateValidator]],
      endDate: ['', [Validators.required]],
      startTime: [
        '',
        [Validators.required, this.trimValidator, this.validTimeFormat],
      ],
      endTime: [
        '',
        [Validators.required, this.trimValidator, this.validTimeFormat],
      ],
      teacher: ['', [Validators.required, this.trimValidator]],
      daysOfWeek: [[], [Validators.required, this.daysOfWeekValidator]],
    });

    this.courseForm
      .get('startDate')
      ?.valueChanges.subscribe(() => this.calculateSessions());
    this.courseForm
      .get('endDate')
      ?.valueChanges.subscribe(() => this.calculateSessions());
    this.courseForm
      .get('daysOfWeek')
      ?.valueChanges.subscribe(() => this.calculateSessions());

    this.getTeachers();
  }

  trimValidator(control: any) {
    const value = control.value as string;
    const isWhitespace = value.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  levelValidator(control: any) {
    const validLevels = ['beginner', 'intermediate', 'advanced', 'kids'];
    return validLevels.includes(control.value) ? null : { invalidLevel: true };
  }
  startDateValidator(control: any) {
    if (control.value) {
      return control.value > Date.now() ? null : { invalidStartDate: true };
    }
    return null;
  }

  daysOfWeekValidator(control: any) {
    const validDaysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    const daysOfWeek = control.value;

    if (!daysOfWeek) {
      return { required: true };
    }

    for (const dayOfWeek of daysOfWeek) {
      if (!validDaysOfWeek.includes(dayOfWeek)) {
        return { invalidDayOfWeek: true };
      }
    }

    return null;
  }
  validTimeFormat(control: any) {
    // Regular expression pattern for 24-hour time format (HH:mm)
    const pattern = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
    if (control.value && !pattern.test(control.value)) {
      return { invalidTimeFormat: true };
    }
    return null;
  }

  greaterThanZeroValidator(control: any) {
    return control.value > 0 ? null : { notGreaterThanZero: true };
  }
  calculateNumberOfSessions(
    startDate: Date,
    endDate: Date,
    daysOfWeek: string[]
  ): number {
    let numSessions = 0;
    const dayOfWeekMs = 24 * 60 * 60 * 1000;
    if (startDate) {
      let currDate = new Date(startDate.getTime());
      while (currDate <= endDate) {
        if (
          daysOfWeek.includes(
            currDate.toLocaleDateString('en-US', {
              weekday: 'long',
            })
          )
        ) {
          numSessions++;
        }
        currDate = new Date(currDate?.getTime() + dayOfWeekMs);
      }
    }
    return numSessions;
  }

  calculateSessions() {
    const startDate = this.courseForm.get('startDate')?.value as Date;
    const endDate = this.courseForm.get('endDate')?.value as Date;
    const daysOfWeek = this.courseForm.get('daysOfWeek')?.value as string[];

    const numSessions = this.calculateNumberOfSessions(
      startDate,
      endDate,
      daysOfWeek
    );

    this.courseForm.patchValue({ numberOfSessions: numSessions });
  }

  getTeachers(): void {
    this.teacher.getTeachersNotPaginated().subscribe({
      next: (data) => {
        this.teachers = data;
      },
      error: (error: any) => {
        let {
          error: { message },
        } = error;
        if (!message) message = error.error.error;
        this.toastr.error(`${message}`, 'Error');
      },
    });
  }

  onSubmit() {
    this.calculateSessions();
    this.courseForm.value.startDate =
      this.courseForm.value.startDate.toLocaleDateString('en-US');
    this.courseForm.value.endDate =
      this.courseForm.value.endDate.toLocaleDateString('en-US');

    this.course.addNewCourse(this.courseForm.value).subscribe({
      next: () => {
        this.course.buttonClicked.emit();
        this.dialog.closeAll();
      },
      error: (error: any) => {
        let {
          error: { message },
        } = error;
        if (!message) message = error.error.error;
        this.toastr.error(`${message}`, 'Error');
      },
    });
  }
  ngOnInit(): void {}
}
