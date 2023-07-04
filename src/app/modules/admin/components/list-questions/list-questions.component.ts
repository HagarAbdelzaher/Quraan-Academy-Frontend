import { Component, OnInit } from '@angular/core';
import { QAService } from '../../services/qa.service';
import swalOptions from 'src/app/utils/swalOptions';
import swal from "sweetalert2";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styleUrls: ['./list-questions.component.css']
})
export class ListQuestionsComponent implements OnInit {
  questions: any = [];
  categories: { name: string, _id: string }[] = [];
  pageInfo: any = {};
  limit = 6;
  categoryID = '';
  currentPage: number = 1;
  answered = false;

  constructor(private _QAService: QAService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getQuestions()
    this.getCategories()
  }

  getQuestions(): void {
    this._QAService.getAllQuestions(this.currentPage, this.limit, this.categoryID, this.answered).subscribe({
      next: (res: any) => {
        if (res.message === 'success') {
          this.questions = res.data.docs;
          this.pageInfo = res.data;
          this.questions.forEach((q: any, index: number) => [
            q.id = index + 1,
          ])
        }
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

  getCategories(): void {
    let params = {
      type: 'question'
    }
    this._QAService.getCategoriesNotPaginated(params).subscribe({
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

  answeredChange() {
    this.answered = !this.answered;
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


  delQuestion(id: any) {
    swal.fire(swalOptions.deleteQuestionOptions).then((result) => {
      if (result.value) {
        this._QAService.deleteQuestion(id).subscribe({
          next: (data) => {
            this.getQuestions();
            this.toastr.success(
              `Question deleted successfully`,
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
  delAnswer(id: any) {
    swal.fire(swalOptions.deleteAnswerOptions).then((result) => {
      if (result.value) {
        this._QAService.deleteAnswer(id).subscribe({
          next: (data) => {
            this.getQuestions();
            this.toastr.success(
              `Answer deleted successfully`,
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
