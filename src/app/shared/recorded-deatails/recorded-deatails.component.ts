import { Component } from '@angular/core';
import { RecordedCoursesService } from 'src/app/services/recorded-courses.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-recorded-deatails',
  templateUrl: './recorded-deatails.component.html',
  styleUrls: ['./recorded-deatails.component.css']
})
export class RecordedDeatailsComponent {

  chapters= [];
  courseId:string='';
  course: {
    _id: string;
    name: string;
    category: {
      name: string;
    };
    numberOfChapters: number;
    price: number;
  } = {
    _id: '',
    name: '',
    category: {
      name: ''
    },
    numberOfChapters: 0,
    price: 0
  };
    constructor(private _recordedDetalis:RecordedCoursesService, private route: ActivatedRoute,private toastr: ToastrService){}

  ngOnInit(){
    this.courseId =  this.route.snapshot.paramMap.get('id') ?? '';
    this.getRecordedCourses();
    this.getCourseById(this.courseId);
  }

  getRecordedCourses():void{
    this._recordedDetalis.getChaptersOfRecordedCourse(this.courseId).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.chapters = res.body;
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

  getCourseById(id:string){
    this._recordedDetalis.getCourseById(this.courseId).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.course = res.body;
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
    enrollCourse(id:string) {
      this._recordedDetalis.enrollCourse(id,'true').subscribe({
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
