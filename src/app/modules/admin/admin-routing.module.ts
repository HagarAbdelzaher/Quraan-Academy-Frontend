import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListCoursesComponent } from "./components/list-courses/list-courses.component";
import { ListTeachersComponent } from "./components/list-teachers/list-teachers.component";
import { ListRecordedCourseComponent } from "./components/list-recorded-course/list-recorded-course.component";
import { ListSessionsComponent } from "./components/list-sessions/list-sessions.component";
import { ListChaptersComponent } from "./components/list-chapters/list-chapters.component";
import { ListStudentsComponent } from "./components/list-students/list-students.component";
import { ListRecordedCourseCategoryComponent } from "./components/list-recorded-course-category/list-recorded-course-category.component";
import { ListQuestionsComponent } from "./components/list-questions/list-questions.component";

const routes: Routes = [
    { path: "courses/list", component: ListCoursesComponent },
    { path: "teachers/list", component: ListTeachersComponent },
    { path: "recordedCourses/list", component: ListRecordedCourseComponent },
    { path: "sessions/list", component: ListSessionsComponent },
    { path: "chapters/list", component: ListChaptersComponent },
    { path: "students/list", component: ListStudentsComponent },
    { path: "questions/list", component: ListQuestionsComponent },
    { path: "questions/categories/list", component: ListQuestionsComponent },
    {
        path: "RecordedCourseCategories/list",
        component: ListRecordedCourseCategoryComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
