import { Component, OnInit } from "@angular/core";
import { RecordedCoursesService } from "../../services/recorded-courses.service";
import { recordedCourseElement } from "../list-recorded-course/list-recorded-course.component";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { ChaptersService } from "../../services/chapters.service";
import { EditChapterMOdalComponent } from "../edit-chapter-modal/edit-chapter-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import swalOptions from "src/app/utils/swalOptions";

@Component({
    selector: "app-list-chapters",
    templateUrl: "./list-chapters.component.html",
    styleUrls: ["./list-chapters.component.css"],
})
export class ListChaptersComponent implements OnInit {
    page: number = 1;
    selectedRecordedCourse: string = "";
    recordedCourses: recordedCourseElement[] = [];
    chapters: chapterElement[] = [];
    dialogConfig = new MatDialogConfig();

    constructor(
        private recordedCourse: RecordedCoursesService,
        private toastr: ToastrService,
        private chapter: ChaptersService,
        private dialog: MatDialog
    ) {
        this.chapter.buttonClicked.subscribe(() => {
            this.getChaptersForRecordedCourses();
        });
        this.getRecordedCourses();
    }

    getRecordedCourses(): void {
        this.recordedCourse.getAllRecordedCoursesNotPaginated().subscribe({
            next: (data) => {
                this.recordedCourses = data;
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

    getChaptersForRecordedCourses(): void {
        if (!this.selectedRecordedCourse) {
            this.chapters = [];
            return;
        }
        this.chapter
            .getChaptersForRecordedCourse(this.selectedRecordedCourse)
            .subscribe({
                next: (data) => {
                    this.chapters = data.map(
                        (chapter: chapterElement, index: number) => ({
                            ...chapter,
                            id: index + 1,
                        })
                    );
                },
            });
    }

    deleteChapter(id: any): void {
      swal.fire(swalOptions.deleteChapterOptions).then((result) => {
        if (result.value) {
          this.chapter.deleteChapter(id).subscribe({
            next: () => {
                this.chapter.buttonClicked.emit();
                this.toastr.success(`Chapter deleted successfully`, "Success");
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

    openEditChapterModal(id: any): void {
        this.dialogConfig.data = {
            chapterId: id,
        };
        this.dialog.open(EditChapterMOdalComponent, this.dialogConfig);
    }
    ngOnInit(): void {}
}

export interface chapterElement {
    id?: number;
    _id?: string;
    title: string;
    description: string;
    media: string;
    recordedCourse: { name: string };
}
