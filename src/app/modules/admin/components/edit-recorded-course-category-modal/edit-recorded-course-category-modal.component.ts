import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { RecordedCourseCategoryService } from "../../services/recorded-course-category.service";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { categoryElement } from "../list-recorded-course/list-recorded-course.component";

@Component({
    selector: "app-edit-recorded-course-category-modal",
    templateUrl: "./edit-recorded-course-category-modal.component.html",
    styleUrls: ["./edit-recorded-course-category-modal.component.css"],
})
export class EditRecordedCourseCategoryModalComponent implements OnInit {
    categoryForm: FormGroup;
    categoryId: string = "";
    categoryInstance: categoryElement = {
        name: "",
    };
    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private category: RecordedCourseCategoryService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: { categoryId: string }
    ) {
        this.categoryId = this.data.categoryId;
        this.categoryForm = this.fb.group({
            name: ["", [Validators.required, this.trimValidator]],
        });
    }
    trimValidator(control: any) {
        const value = control.value as string;
        const isWhitespace = value.trim().length === 0;
        return isWhitespace ? { whitespace: true } : null;
    }
    ngOnInit(): void {
        this.categoryId = this.data.categoryId;
        this.category.getCategoryById(this.categoryId).subscribe({
            next: (data) => {
                this.categoryInstance = data;
                this.categoryForm.patchValue({
                    name: data.name,
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
    onSubmit(): void {
        this.category
            .updateCategory(this.categoryId, this.categoryForm.value)
            .subscribe({
                next: () => {
                    this.category.buttonClicked.emit();
                    this.toastr.success(
                        `Recorded course category updated successfully`,
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
}
