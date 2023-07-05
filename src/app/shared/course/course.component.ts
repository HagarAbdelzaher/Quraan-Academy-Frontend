import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { RecordedCoursesService } from 'src/app/services/recorded-courses.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit {
  courses: courseElement[] = [];
  teachers: any[] = [];
  selectedTeacher: string = 'All';
  selectedLevel: string = 'All';
  currentPage: number = 1;
  pageSize: number = 6;
  hasPrevPage: boolean = false;
  hasNextPage: boolean = false;
  role: string = 'none';
  isLoading: boolean = true;
  // role = none -> Navigate to login
  // role = student -> Navigate to payment
  // role = teacher -> No button
  constructor(
    private course: CourseService,
    auth: AuthService,
    private _RecordedCoursesService: RecordedCoursesService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.course.buttonClicked.subscribe(() => {
      this.getCourses();
    });
    this.role = auth.getRole();
  }

  ngOnInit(): void {
    this.getCourses();
    this.getAllTeachers();
  }

  getCourses(): void {
    this.isLoading = true;
    const params = {
      page: this.currentPage,
      teacher:
        this.selectedTeacher !== 'All'
          ? this.selectedTeacher.toLocaleLowerCase()
          : null,
      level:
        this.selectedLevel !== 'All'
          ? this.selectedLevel.toLocaleLowerCase()
          : null,
    };
    this.course.getCourses(params).subscribe({
      next: (data: any) => {
        this.courses = data.docs.map((course: any, index: number) => ({
          ...course,
          id: index + 1,
        }));

        this.hasNextPage = data.hasNextPage;
        this.hasPrevPage = data.hasPrevPage;
        this.isLoading = false;
      },
    });
  }

  getAllTeachers(): void {
    this.course.getAllTeachers().subscribe({
      next: (data: any) => {
        this.teachers = data.map((teacher: any, index: number) => ({
          ...teacher,
          id: index + 1,
          showBubble: false,
        }));
      },
    });
  }

  onPageChanged(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getCourses();
  }
  showBubble(course: courseElement) {
    course.showBubble = !course.showBubble;
  }
  nextPage() {
    if (this.hasNextPage) {
      this.currentPage++;
      this.getCourses();
    }
  }
  prevPage() {
    if (this.hasPrevPage) {
      this.currentPage--;
      this.getCourses();
    }
  }

  enrollCourse(id: string, role: string) {
    if (role != 'student') {
      this.router.navigate(['/login/user']);
    } else {
      this._RecordedCoursesService.enrollCourse(id).subscribe({
        next: (res: any) => {
          if (res.body === 'free') {
          this.toastr.success('Enrolled Successfully','Success');
            this.router.navigate(['/student/courses'])
            return
          }
          if (res.status === 200) {
            window.location.href = res.body;
            return
          }
        },
        error: (err) => {
          this.toastr.error(`${err.error.error}`);
        },
      });
    }
  }
  getDate(stringDate: string): string {
    const date = new Date(stringDate);
    const day = date.getDate(); // day of the month (from 1 to 31)
    const month = date.getMonth() + 1; // month (from 0 to 11)
    const year = date.getFullYear(); // year (as a four-digit number)

    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
    return formattedDate;
  }
  hasCourseEnded(course: courseElement): boolean {
    const endDate = new Date(course.endDate);
    return endDate < new Date();
  }
}
export interface courseElement {
  id?: number;
  _id: string;
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
  showBubble: boolean;
}
