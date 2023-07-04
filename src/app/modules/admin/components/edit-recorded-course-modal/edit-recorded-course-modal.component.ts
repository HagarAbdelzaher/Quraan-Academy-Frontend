import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { RecordedCoursesService } from "../../services/recorded-courses.service";
import { RecordedCourseCategoryService } from "../../services/recorded-course-category.service";
import { categoryElement } from "../list-recorded-course/list-recorded-course.component";

@Component({
    selector: "app-edit-recorded-course-modal",
    templateUrl: "./edit-recorded-course-modal.component.html",
    styleUrls: ["./edit-recorded-course-modal.component.css"],
})
export class EditRecordedCourseModalComponent implements OnInit {
    recordedCourseId: string = "";
    editForm: FormGroup;
    recordedCourseInstance: any;
    categories: categoryElement[] = [];

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private category: RecordedCourseCategoryService,
        private recordedCourse: RecordedCoursesService,
        @Inject(MAT_DIALOG_DATA) public data: { recordedCourseId: string }
    ) {
        this.recordedCourseId = this.data.recordedCourseId;

        this.editForm = this.fb.group({
            name: ["", [Validators.required, this.trimValidator]],
            price: [
                "",
                [
                    Validators.required,
                    this.greaterThanZeroValidator,
                ],
            ],
            category: ["", [Validators.required]],
        });
        this.getCategories();
    }

    trimValidator(control: any) {
        const value = control.value as string;
        const isWhitespace = value.trim().length === 0;
        return isWhitespace ? { whitespace: true } : null;
    }

    greaterThanZeroValidator(control: any) {
        return control.value > 0 ? null : { notGreaterThanZero: true };
    }

    getCategories(): void {
        this.category.getRecordedCourseCategoriesNotPaginated({type: 'recordedCourse'}).subscribe({
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

    onSubmit(): void {
        this.recordedCourse
            .updateRecordedCourse(this.recordedCourseId, this.editForm.value)
            .subscribe({
                next: () => {
                    this.recordedCourse.buttonClicked.emit();
                    this.toastr.success(
                        `Recorded course updated successfully`,
                        "Success"
                    );
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
    ngOnInit(): void {
        this.recordedCourseId = this.data.recordedCourseId;
        this.recordedCourse
            .getRecordedCourseById(this.recordedCourseId)
            .subscribe({
                next: (data) => {
                    this.recordedCourseInstance = data;
                    this.editForm.patchValue({
                        name: data.name,
                        price: data.price,
                        category: data.category._id,
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
}
