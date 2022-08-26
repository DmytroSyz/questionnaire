import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CreateQuestionComponent} from "./components/create-question/create-question.component";
import {EditQuestionComponent} from "./components/edit-question/edit-question.component";
import {QuestionListComponent} from "./components/question-list/question-list.component";
import {QuestionManagementComponent} from "./components/question-management/question-management.component";

const appRoutes: Routes = [
  {
    path: 'create',
    component: CreateQuestionComponent
  },
  {
    path: 'edit',
    component: EditQuestionComponent
  },
  {
    path: 'list',
    component: QuestionListComponent
  },
  {
    path: 'management',
    component: QuestionManagementComponent
  },
  {
    path: '**',
    redirectTo: '/management'
  }
]


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
    ]
})
export class AppRoutingModule {}
