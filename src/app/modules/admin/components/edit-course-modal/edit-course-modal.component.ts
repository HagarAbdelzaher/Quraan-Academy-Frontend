import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CourseService } from '../../services/course.service';
import { ToastrService } from 'ngx-toastr';
import { TeacherService } from '../../services/teacher.service';
import { teacherElement } from '../list-teachers/list-teachers.component';

@Component({
  selector: 'app-edit-course-modal',
  templateUrl: './edit-course-modal.component.html',
  styleUrls: ['./edit-course-modal.component.css'],
})
export class EditCourseModalComponent implements OnInit {
  courseForm: FormGroup;
  courseId: string = '';
  courseInstance: any;
  teachers: teacherElement[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private course: CourseService,
    private teacher: TeacherService,
    private dialogRef: MatDialogRef<EditCourseModalComponent>,

    @Inject(MAT_DIALOG_DATA) public data: { courseId: string }
  ) {
    this.course.getCourse(this.courseId).subscribe({
      next: (data) => {
        this.courseInstance = data;
      },
    });
    this.courseForm = this.formBuilder.group({
      name: [''],
      level: ['', [this.levelValidator]],
      description: ['', [Validators.minLength(10)]],
      numberOfSessions: [''],
      price: ['', [this.greaterThanZeroValidator]],
      startDate: [''],
      endDate: [''],
      startTime: ['', this.validTimeFormat],
      endTime: ['', this.validTimeFormat],
      teacher: [''],
      daysOfWeek: [[], [this.daysOfWeekValidator]],
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

  levelValidator(control: any) {
    const validLevels = ['beginner', 'intermediate', 'advanced', 'kids'];
    return validLevels.includes(control.value) ? null : { invalidLevel: true };
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
      return null;
    }

    for (const dayOfWeek of daysOfWeek) {
      if (!validDaysOfWeek.includes(dayOfWeek)) {
        return { invalidDayOfWeek: true };
      }
    }

    return null;
  }

  greaterThanZeroValidator(control: any) { }

  calculateNumberOfSessions(
    startDate: Date | null | undefined,
    endDate: Date | null | undefined,
    daysOfWeek: string[]
  ): number {
    let numSessions = 0;
    const dayOfWeekMs = 24 * 60 * 60 * 1000;
    if (startDate instanceof Date && endDate instanceof Date) {
      let currDate = new Date(startDate.getTime());
      while (currDate <= endDate) {
        if (
          daysOfWeek.includes(
            currDate.toLocaleDateString('en-US', { weekday: 'long' })
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
    const startDateStr = this.courseForm.get('startDate')?.value as string;
    const endDateStr = this.courseForm.get('endDate')?.value as string;
    const daysOfWeek = this.courseForm.get('daysOfWeek')?.value as string[];

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const numSessions = this.calculateNumberOfSessions(
      startDate,
      endDate,
      daysOfWeek
    );

    this.courseForm.patchValue({ numberOfSessions: numSessions });
  }
  validTimeFormat(control: any) {
    // Regular expression pattern for 24-hour time format (HH:mm)
    const pattern = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
    if (control.value && !pattern.test(control.value)) {
      return { invalidTimeFormat: true };
    }
    return null;
  }
  ngOnInit(): void {
    this.courseId = this.data.courseId;
    this.course.getCourse(this.courseId).subscribe({
      next: (data) => {
        this.courseForm.patchValue({
          name: data.name,
          description: data.description,
          level: data.level,
          startTime: data.startTime,
          endTime: data.endTime,
          startDate: data.startDate,
          endDate: data.endDate,
          teacher: data.teacher,
          price: data.price,
          daysOfWeek: data.daysOfWeek,
          numberOfSessions: data.numberOfSessions ?? null,
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
    this.calculateSessions();
    this.courseForm.value.startDate = new Date(
      this.courseForm.value.startDate
    ).toLocaleDateString('en-US');
    this.courseForm.value.endDate = new Date(
      this.courseForm.value.endDate
    ).toLocaleDateString('en-US');

    this.course.updateCourse(this.courseId, this.courseForm.value).subscribe({
      next: () => {
        this.course.buttonClicked.emit();
        this.toastr.success(`Course updated successfully`, 'Success');
        this.dialogRef.close();
      },
      error: (error) => {
        let {
          error: { message },
        } = error;
        if (!message) message = error.message;

        if (error.status === 400) {
          this.toastr.error(
            'Can not update course is already started',
            'Error'
          );
        } else {
          this.toastr.error(
            'Can not update course now',
            'Error'
          );
        }
      },
    });
  }
}
