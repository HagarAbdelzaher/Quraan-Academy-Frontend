import { Component, OnInit } from "@angular/core";
import { RecordedCourseCategoryService } from "../../services/recorded-course-category.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import swal from "sweetalert2";
import { categoryElement } from "../list-recorded-course/list-recorded-course.component";
import { AddRecordedCourseCategoryModalComponent } from "../add-recorded-course-category-modal/add-recorded-course-category-modal.component";
import { EditRecordedCourseCategoryModalComponent } from "../edit-recorded-course-category-modal/edit-recorded-course-category-modal.component";
import swalOptions from "src/app/utils/swalOptions";

@Component({
    selector: "app-list-recorded-course-category",
    templateUrl: "./list-recorded-course-category.component.html",
    styleUrls: ["./list-recorded-course-category.component.css"],
})
export class ListRecordedCourseCategoryComponent implements OnInit {
    page: number = 1;
    pageInfo: any;
    categories: categoryElement[] = [];
    dialogConfig = new MatDialogConfig();
    type: string = '';
    constructor(
        private category: RecordedCourseCategoryService,
        private toastr: ToastrService,
        private dialog: MatDialog
    ) {
        this.category.buttonClicked.subscribe(() => {
            this.getCategories();
        });
    }

    getCategories(): void {
        const params = {
            page: this.page,
            limit: 6,
            type: this.type
        };
        this.category.getRecordedCourseCategoriesPaginated(params).subscribe({
            next: (data) => {
                this.pageInfo = data;
                this.categories = data.docs.map(
                    (category: categoryElement, index: number) => ({
                        ...category,
                        id: index + 1,
                    })
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


    nextPage() {
        if (this.pageInfo.hasNextPage) {
          this.page++;
          this.getCategories()
        }
      }
      prevPage() {
        if (this.pageInfo.hasPrevPage) {
          this.page--;
          this.getCategories()
        }
      }
    openAddCategoryModal(): void {
        this.dialog.open(AddRecordedCourseCategoryModalComponent, {
            width: "800px",
        });
    }
    openEditCategoryModal(id: any): void {
        this.dialogConfig.data = {
            categoryId: id,
        };
        this.dialog.open(
            EditRecordedCourseCategoryModalComponent,
            this.dialogConfig
        );
    }
    deleteCategory(id: any): void {
        swal.fire(swalOptions.deleteCategoryOptions).then((result) => {
            if (result.value) {
                this.category.deleteCategory(id).subscribe({
                    next: () => {
                        this.category.buttonClicked.emit();
                        this.toastr.success(
                            `Category deleted successfully`,
                            `success`
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
        this.getCategories();
    }
}
