import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataService, IAnswer, IQuestion, QuestionType} from "../../services/data.service";

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit {

  public createQuestionGroup: FormGroup;
  public questionType: QuestionType;
  public submitted = false;
  public questionTypes = ['single', 'multiple', 'open'];

  private question: IQuestion

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {

  }


  ngOnInit(): void {
    this.dataService.editedQuestion$.subscribe((res: IQuestion) => {
      this.question = res;
      this.questionType = res.type;
      this.createQuestionGroup = this.fb.group({
        text: [res.text, Validators.required],
        type: [res, Validators.required],
        answers: this.fb.array([]),
      });
      res.answers.forEach((answer) => {
        this.answers().push(this.newAnswer(answer));
      })
    })

  }

  public selectType(type: QuestionType): void {
    if ((type === 'single' || type === 'multiple') && this.createQuestionGroup.get('answers')?.value < 3) {
      this.addAnswer();
      this.addAnswer();
    }
    if (type === 'open') {
      this.answers().clear()
    }
    this.questionType = type;
  }

  public answers(): FormArray {
    return this.createQuestionGroup.get('answers') as FormArray
  }

  private newAnswer(data?: IAnswer): FormGroup {
    if (data) {
      return this.fb.group({
        text: [data.text, Validators.required],
        checked: false,
        id: data.id
      })
    } else {
      return this.fb.group({
        text: ['', Validators.required],
        checked: false,
        id: crypto.randomUUID()
      })
    }

  }

  public addAnswer(): void {
    this.answers().push(this.newAnswer());
  }

  public removeAnswer(i: number): void {
    this.answers().removeAt(i);
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.createQuestionGroup.invalid) {
      return;
    }

    const question = {
      text: this.createQuestionGroup.value.text,
      answers: this.createQuestionGroup.value.answers,
      type: this.questionType,
      date: new Date(),
      id: this.question.id,
      answered: false,
      error: this.question.error
    }
    this.dataService.editQuestion(question);
  }

}
