import { Component } from '@angular/core';
import { RecordedCoursesService } from 'src/app/services/recorded-courses.service';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-recorded-courses',
  templateUrl: './recorded-courses.component.html',
  styleUrls: ['./recorded-courses.component.css']
})
export class RecordedCoursesComponent {

  recordedCourses = [];
  categories: { name: string, _id: string }[] = [];
  category = '';
  limit = 6;
  currentPage: number = 1;
  hasNextPage: boolean = false;
  hasPrevPage: boolean = false;
  isLoading: boolean = true;
  constructor(private _RecordedCoursesService: RecordedCoursesService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getRecordedCourses();
    this._RecordedCoursesService.getAllRecordedCourseCategory().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.categories = res.body.docs;
        }

      },
      error: (error: any) => {
        let {
          error: { message },
        } = error;
        if (!message) message = error.error.error;
        this.toastr.error(`${message}`, "Error");
      },
    })
  }

  getRecordedCourses(): void {
    this._RecordedCoursesService.getAllRecordedCourses(this.currentPage, this.limit, this.category).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.recordedCourses = res.body.docs;
          this.hasNextPage = res.body.hasNextPage;
          this.hasPrevPage = res.body.hasPrevPage;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        let {
          error: { message },
        } = error;
        if (!message) message = error.error.error;
        this.toastr.error(`${message}`, "Error");
        this.isLoading = false
      },
    });
  }
  changeCategory() {
    this.currentPage = 1;
    this.getRecordedCourses()
  }

  nextPage() {
    if (this.hasNextPage) {
      this.currentPage++;
      this.getRecordedCourses()
    }
  }
  prevPage() {
    if (this.hasPrevPage) {
      this.currentPage--;
      this.getRecordedCourses()
    }
  }

  enrollCourse(event: Event, id: string) {
    event.stopPropagation();
    this._RecordedCoursesService.enrollCourse(id, 'true').subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          window.location.href = res.body;

        }
      },
      error: (err) => {
        this.toastr.error(`${err.error.error}`);
      }
    });
  }
}
