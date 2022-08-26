import {Component, OnInit} from '@angular/core';
import {DataService, IAnswer, IQuestion} from "../../services/data.service";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

  public answeredQuestion: IQuestion[];
  public unansweredQuestion: IQuestion[];

  public submitted: boolean | string = false;

  public selection = new SelectionModel<any>(false, []);

  constructor(public dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.questions$.subscribe((res: IQuestion[]) => {
      this.answeredQuestion = res.filter((question: IQuestion) => {
        return question.answered === true;
      }).sort((a, b) =>
        Date.parse(b.answerDate.toString()) - Date.parse(a.answerDate.toString()));

      this.unansweredQuestion = res.filter((question: IQuestion) => {
        return question.answered === false;
      }).sort((a, b) =>
        Date.parse(b.date.toString()) - Date.parse(a.date.toString()));
      this.selection.clear();
    })
  }

  public submitAnswer(question: IQuestion): void {
    this.submitted = question.id;
    if (question.type === 'single') {
      question.answers.forEach((answer: IAnswer) => {
        this.selection.isSelected(answer.id) ? answer.checked = true : answer.checked = false;
      })
    }
    if (question.type === 'open' && !question.openAnswer) {
      question.error = 'Should be at least one character'
      return;
    }

    if (question.type !== 'open') {
      const isAnswerSelected = question.answers.map((answer: IAnswer) => {
        return answer.checked;
      }).some((element) => element === true)

      if (!isAnswerSelected) {
        question.error = 'Select one'
        return;
      }
    }
    question.answerDate = new Date();
    this.submitted = false;
    this.dataService.answerQuestion(question.id);
  }

  public cancelAnswer(question: IQuestion): void {
    this.dataService.cancelAnswer(question.id);
  }

}
