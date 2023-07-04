import { Component, OnInit } from "@angular/core";
import { RecordedCoursesService } from "../../services/recorded-courses.service";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { RecordedCourseCategoryService } from "../../services/recorded-course-category.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AddRecordedCourseComponent } from "../add-recorded-course/add-recorded-course.component";
import { AddChaptersModalComponent } from "../add-chapters-modal/add-chapters-modal.component";
import { EditRecordedCourseModalComponent } from "../edit-recorded-course-modal/edit-recorded-course-modal.component";
import swalOptions from "src/app/utils/swalOptions";

@Component({
  selector: "app-list-recorded-course",
  templateUrl: "./list-recorded-course.component.html",
  styleUrls: ["./list-recorded-course.component.css"],
})
export class ListRecordedCourseComponent implements OnInit {
  page: number = 1;
  selectedCategory: string = "None";
  recordedCourses: recordedCourseElement[] = [];
  categories: categoryElement[] = [];
  dialogConfig = new MatDialogConfig();
  hasNextPage: boolean = false;
  hasPrevPage: boolean = false;

  constructor(
    private recordedCourse: RecordedCoursesService,
    private toastr: ToastrService,
    private category: RecordedCourseCategoryService,
    private dialog: MatDialog
  ) {
    this.recordedCourse.buttonClicked.subscribe(() => {
      this.getRecordedCourses();
    });
    this.getCategories();
  }
  ngOnInit(): void {
    this.selectedCategory = "";
    this.getRecordedCourses();
  }

  getRecordedCourses(): void {
    const params = {
      page: this.page,
      category:
        this.selectedCategory !== "None" ? this.selectedCategory : null,
    };
    this.recordedCourse.getRecordeCourses(params).subscribe({
      next: (data) => {
        this.recordedCourses = data.docs.map(
          (course: recordedCourseElement, index: number) => ({
            ...course,
            id: index + 1,
          })
        );
        this.hasNextPage = data.hasNextPage;
        this.hasPrevPage = data.hasPrevPage;
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

  prevPage() {
    if (this.page > 1 && this.hasPrevPage) {
      this.page--;
      this.getRecordedCourses();
    }
  }

  nextPage() {
    if (this.hasNextPage) {
      this.page++;
      this.getRecordedCourses();
    }
  }
  getCategories(): void {
    let params = {
      type: 'recordedCourse'
    }
    this.category.getRecordedCourseCategoriesNotPaginated(params).subscribe({
      next: (data) => {
        this.categories = data;
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

  openAddCourseModal(): void {
    this.dialog.open(AddRecordedCourseComponent, { width: "800px" });
  }

  openAddChaptersModal(id: any): void {
    this.dialogConfig.data = {
      recordedCourseId: id,
    };
    this.dialog.open(AddChaptersModalComponent, this.dialogConfig);
  }

  openEditRecordedCourseModal(id: any): void {
    this.dialogConfig.data = {
      recordedCourseId: id,
    };
    this.dialog.open(EditRecordedCourseModalComponent, this.dialogConfig);
  }
  deleteRecordedCourse(id: any) {
    swal.fire(swalOptions.deleteRecordedCourseOptions).then((result) => {
      if (result.value) {
        this.recordedCourse.deleterecordedCourses(id).subscribe({
          next: (data) => {
            this.recordedCourse.buttonClicked.emit();
            this.toastr.success(
              `Recorded course deleted successfully`,
              "Success"
            );
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
    });
  }
}

export interface recordedCourseElement {
  id?: number;
  _id?: string;
  name: string;
  numberOfChapters: number;
  price: number;
  category: { name: string };
}

export interface categoryElement {
  id?: number;
  _id?: string;
  name: string;
  type?: string;
}
