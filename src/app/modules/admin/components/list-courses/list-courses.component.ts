import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { CourseService } from '../../services/course.service';
import { AddCourseModalComponent } from '../add-course-modal/add-course-modal.component';
import { EditCourseModalComponent } from '../edit-course-modal/edit-course-modal.component';

import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import swalOptions from 'src/app/utils/swalOptions';
import { TeacherService } from '../../services/teacher.service';
import { teacherElement } from '../list-teachers/list-teachers.component';
@Component({
  selector: 'app-list-courses',
  templateUrl: './list-courses.component.html',
  styleUrls: ['./list-courses.component.css'],
})
export class ListCoursesComponent implements OnInit {
  page: number = 1;
  selectedTeacher: string = '';
  selectedLevel: string = 'All';
  courses: courseElement[] = [];
  teachers: teacherElement[] = [];
  dialogConfig = new MatDialogConfig();
  hasNextPage: boolean = false;
  hasPrevPage: boolean = false;

  constructor(
    private course: CourseService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private teacher: TeacherService
  ) {
    this.course.buttonClicked.subscribe(() => {
      this.getCourses();
    });
    this.getTeachers();
  }

  getCourses(): void {
    const params = {
      page: this.page,
      teacher:
        this.selectedTeacher !== 'None'
          ? this.selectedTeacher.toLocaleLowerCase()
          : null,
      level:
        this.selectedLevel !== 'All'
          ? this.selectedLevel.toLocaleLowerCase()
          : null,
    };
    this.course.getcourses(params).subscribe({
      next: (data: any) => {
        this.courses = data.docs.map((course: any, index: number) => ({
          ...course,
          startDate: course.startDate.split('T')[0],
          endDate: course.endDate.split('T')[0],
          id: index + 1,
        }));
        this.hasNextPage = data.hasNextPage;
        this.hasPrevPage = data.hasPrevPage;
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

  prevPage() {
    if (this.page > 1 && this.hasPrevPage) {
      this.page--;
      this.getCourses();
    }
  }

  nextPage() {
    if (this.hasNextPage) {
      this.page++;
      this.getCourses();
    }
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

  openAddCourseModal(): void {
    this.dialog.open(AddCourseModalComponent, { width: '800px' });
  }

  openEditCourseModal(id: any) {
    this.dialogConfig.data = {
      courseId: id,
    };
    this.dialog.open(EditCourseModalComponent, this.dialogConfig);
  }

  delCourse(id: any) {
    swal.fire(swalOptions.deleteCourseOptions).then((result) => {
      if (result.value) {
        this.course.deleteCourse(id).subscribe({
          next: (data) => {
            this.course.buttonClicked.emit();
            this.toastr.success(`Course deleted successfully`, 'Success');
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
    });
  }

  ngOnInit(): void {
    this.getCourses();
  }
}

export interface courseElement {
  id?: number;
  _id?: string;
  name: string;
  level: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  price: number;
  teacher: {
    firstName: string;
    lastName: string;
  };
  countOfStudents: number;
}
