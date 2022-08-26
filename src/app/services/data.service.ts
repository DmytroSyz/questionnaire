import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, take} from "rxjs";
import {Router} from "@angular/router";


export type QuestionType = 'single' | 'multiple' | 'open';
export interface IAnswer {
  checked?: boolean;
  text: string;
  id: string;
}

export interface IQuestion {
  text: string;
  type: QuestionType;
  answers: IAnswer[];
  date: Date;
  id: string;
  answered: boolean;
  openAnswer?: string;
  answerDate?: Date;
  error: boolean | string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public editedQuestion: BehaviorSubject<IQuestion> =
    new BehaviorSubject<IQuestion>(JSON.parse(localStorage.getItem('editedQuestion')))
  public editedQuestion$: Observable<IQuestion> = this.editedQuestion.asObservable()

  public questions: BehaviorSubject<IQuestion[]> =
    new BehaviorSubject<IQuestion[]>(JSON.parse(localStorage.getItem('questions')) || [])
  public questions$: Observable<IQuestion[]> = this.questions.asObservable();

  constructor(private router: Router) {
  }

  public createQuestion(question: IQuestion): void {
    this.questions$.pipe(take(1)).subscribe((res: IQuestion[]) => {
      res.push(question)
      localStorage.setItem('questions', JSON.stringify(res));
    });
    this.router.navigate(['/management'])
  }

  public deleteQuestion(id: string): void {
    this.questions$.pipe(take(1)).subscribe((res: IQuestion[]) => {
      const filtered = res.filter(question => question.id !== id);
      localStorage.setItem('questions', JSON.stringify(filtered));
      this.questions.next(filtered);
    })
  }

  public answerQuestion(id: string, answer?: string): void {
    this.questions$.pipe(take(1)).subscribe((res: IQuestion[]) => {
      res.forEach((question: IQuestion) => {
        if (question.id === id) {
          question.answered = true;
        }
        if (question.answered !== true) {
          question.answers.forEach((res: IAnswer) => {
            res.checked = false;
          })
        }
      })
      localStorage.setItem('questions', JSON.stringify(res));
      this.questions.next(res);
    })
  }

  public cancelAnswer(id: string): void {
    this.questions$.pipe(take(1)).subscribe((res: IQuestion[]) => {
      res.forEach((question) => {
        if (question.id === id) {
          question.error = false;
          if (question.type === 'open') {
            question.openAnswer = '';
          }
          question.answers.forEach((answer: IAnswer) => {
            answer.checked = false;
          })
          question.answered = false;
        }
      })

      localStorage.setItem('questions', JSON.stringify(res));
      this.questions.next(res);
    })
  }

  public editQuestion(question: IQuestion): void {
    this.questions$.pipe(take(1)).subscribe((res: IQuestion[]) => {
      res.forEach((val: IQuestion, index) => {
        if (val.id === question.id) {
          res[index] = question;
        }
      })
      localStorage.setItem('questions', JSON.stringify(res));
      localStorage.removeItem('editedQuestion');
      this.questions.next(res);
      this.router.navigate(['/management'])
    })
  }
}
