import { Component, OnInit } from "@angular/core";
import { TeacherService } from "../../services/teacher.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AddTeacherModalComponent } from "../add-teacher-modal/add-teacher-modal.component";
import { ToastrService } from "ngx-toastr";
import { EditTeacherModalComponent } from "../edit-teacher-modal/edit-teacher-modal.component";
import swal from "sweetalert2";
import swalOptions from "src/app/utils/swalOptions";
@Component({
    selector: "app-list-teachers",
    templateUrl: "./list-teachers.component.html",
    styleUrls: ["./list-teachers.component.css"],
})
export class ListTeachersComponent implements OnInit {
    page: number = 1;
    selectedGender: string = "All";
    teachers: teacherElement[] = [];
    dialogConfig = new MatDialogConfig();
    constructor(
        private teacher: TeacherService,
        private toastr: ToastrService,
        public dialog: MatDialog
    ) {
        this.teacher.buttonClicked.subscribe(() => {
            this.getTeachers();
        });
    }

    getTeachers(): void {
        const params = {
            page: this.page,
            gender: this.selectedGender !== "All" ? this.selectedGender : null,
        };
        this.teacher.getTeachers(params).subscribe({
            next: (data: any) => {
                this.teachers = data.map((teacher: any, index: number) => ({
                    ...teacher,
                    id: index + 1,
                }));
            },
        });
    }

    prevPage() {
        if (this.page > 1) {
            this.page--;
            this.getTeachers();
        }
    }

    nextPage() {
        this.page++;
        this.getTeachers();
    }

    openAddTeacherModal(): void {
        this.dialog.open(AddTeacherModalComponent, { width: "800px" });
    }

    openEditTeacherModal(id: any) {
        this.dialogConfig.data = {
            teacherId: id,
        };
        this.dialogConfig.width = "800px";
        this.dialog.open(
            EditTeacherModalComponent,
            this.dialogConfig
        );
    }
    delTeacher(id: any) {
        swal.fire(swalOptions.deleteTeacherOptions).then((result) => {
            if (result.value) {
                this.teacher.deleteTeacher(id).subscribe({
                    next: (data) => {
                        this.teacher.buttonClicked.emit();
                        this.toastr.success(
                            "Teacher deleted successfully",
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
    ngOnInit(): void {
        this.getTeachers();
    }
}

export interface teacherElement {
    id?: number;
    _id?: string;
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    DOB: string;
}
