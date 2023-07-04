import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { ChaptersService } from "../../services/chapters.service";
import { chapterElement } from "../list-chapters/list-chapters.component";

@Component({
    selector: "app-edit-chapter-modal",
    templateUrl: "./edit-chapter-modal.component.html",
    styleUrls: ["./edit-chapter-modal.component.css"],
})
export class EditChapterMOdalComponent implements OnInit {
    editForm: FormGroup;
    chapterId: string = "";
    chapterInstance: chapterElement = {
        title: "",
        description: "",
        media: "",
        recordedCourse: {
            name: "",
        },
    };

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private chapter: ChaptersService,
        @Inject(MAT_DIALOG_DATA) public data: { chapterId: string }
    ) {
        this.chapterId = this.data.chapterId;
        this.editForm = this.fb.group({
            title: [
                "",
                [
                    Validators.required,
                    Validators.minLength(3),
                    this.trimValidator,
                ],
            ],
            description: [
                "",
                [
                    Validators.required,
                    Validators.minLength(10),
                    this.trimValidator,
                ],
            ],
            media: ["", [Validators.required, this.trimValidator]],
        });
    }
    trimValidator(control: any) {
        const value = control.value as string;
        const isWhitespace = value.trim().length === 0;
        return isWhitespace ? { whitespace: true } : null;
    }
    onSubmit(): void {
        this.chapter
            .updateChapter(this.chapterId, this.editForm.value)
            .subscribe({
                next: () => {
                    this.chapter.buttonClicked.emit();
                    this.toastr.success(
                        `Chapter updated successfully`,
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
        this.chapterId = this.data.chapterId;
        this.chapter.getChapterById(this.chapterId).subscribe({
            next: (data) => {
                this.chapterInstance = data;
                this.editForm.patchValue({
                    title: data.title,
                    description: data.description,
                    media: data.media,
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
