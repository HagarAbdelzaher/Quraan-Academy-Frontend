import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import currentDomain from 'src/app/utils/domainUrls';
@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  domain: string = currentDomain;
  buttonClicked = new EventEmitter();

  constructor(private http: HttpClient, private auth: AuthService) { }

  handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
  getSessions(params?: any): Observable<any> {
    let url = `${this.domain}/session/teacher`;
    if (params && params.month) {
      url += `?month=${params.month}`;
    }
    if (params && params.year) {
      url += `&year=${params.year}`;
    }

    return this.http.get(url).pipe(catchError(this.handleError));
  }
  updateTeacherProfile(newData: any): Observable<any> {
    const { _id, createdAt,updatedAt,__v, ...updatedData } = newData;
    return this.http.patch(`${this.domain}/teacher/updateprofile`,updatedData);
  }

  getTeacherProfile(): Observable<any> {
    return this.http.get(`${this.domain}/teacher/profile`).pipe(catchError(this.handleError));}
    
  getTeacherCourses(params?: any): Observable<any> {
    let url = `${this.domain}/course/?page=${params.page}`;

    params.teacher = this.auth.getDecodedToken().id;
    url += `&teacher=${params.teacher}`;
    if (params && params.level) {
      url += `&level=${params.level}`;
    }
    return this.http.get(url).pipe(catchError(this.handleError));
  }
  getCourseDetails(id: string): Observable<any> {
    let url = `${this.domain}/teacher/course/${id}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }
  getSessionDetails(id: string): Observable<any> {
    let url = `${this.domain}/teacher/session/${id}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }
  createMeeting(id: string): Observable<any> {
    let url = `${this.domain}/session/create-meeting/${id}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }
}
