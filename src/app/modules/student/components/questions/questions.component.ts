import { Component, OnInit } from '@angular/core';
import { QAService } from '../../services/qa.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import swal from "sweetalert2";
import swalOptions from "src/app/utils/swalOptions";
import { ToastrService } from "ngx-toastr";
import { EditQuestionModalComponent } from '../edit-question-modal/edit-question-modal.component';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  questions: any = [];
  categories: { name: string, _id: string }[] = [];
  pageInfo: any = {};
  limit = 20;
  categoryID = '';
  teacherID = '';
  currentPage: number = 1;
  dialogConfig = new MatDialogConfig();

  constructor(private _QAService: QAService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getQuestions()
    this._QAService.getCategories().subscribe({
      next: (res: any) => {
        if (res.message === 'success') {
          this.categories = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getQuestions(): void {
    this._QAService.getStudentQuestions(this.currentPage, this.limit, this.categoryID, this.teacherID).subscribe({
      next: (res: any) => {
        if (res.message === 'success') {
          this.questions = res.data.docs;
          this.pageInfo = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  changeCategory() {
    this.currentPage = 1;
    this.getQuestions()
  }

  nextPage() {
    if (this.pageInfo.hasNextPage) {
      this.currentPage++;
      this.getQuestions()
    }
  }
  prevPage() {
    if (this.pageInfo.hasPrevPage) {
      this.currentPage--;
      this.getQuestions()
    }
  }

  deleteQuestion(id: any) {
    swal.fire(swalOptions.deleteQuestionOptions).then((result) => {
      if (result.value) {
        this._QAService.deleteQuestion(id).subscribe({
          next: (data) => {
            this.toastr.success(
              `question deleted successfully`,
              "Success"
            );
            this.getQuestions()
          },
          error: (error: any) => {
            let {
              error: { message },
            } = error;
            if (!message) message = error.error.error;
            console.log(message);
            this.toastr.error(`${message}`, "Error");
          },
        });
      }
    });
  }

  openEditQuestionModal(id: any): void {
    this.dialogConfig.data = {
        // recordedCourseId: id,
    };
    this.dialog.open(EditQuestionModalComponent, this.dialogConfig);
}
}
