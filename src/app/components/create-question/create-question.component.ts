import {Component, OnInit} from '@angular/core';
import {DataService, QuestionType} from "../../services/data.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss']
})
export class CreateQuestionComponent implements OnInit {

  public createQuestionGroup: FormGroup;
  public questionType: QuestionType;
  public submitted = false;

  public questionTypes = ['single', 'multiple', 'open'];

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    this.createQuestionGroup = this.fb.group({
      text: ['', Validators.required],
      type: ['', Validators.required],
      answers: this.fb.array([]),
    });
  }


  ngOnInit(): void {
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

  private newAnswer(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      checked: false,
      id: crypto.randomUUID()
    })
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
      answers: this.questionType === 'open' ?
        [{id: crypto.randomUUID(), text: '', answered: null}] :
        this.createQuestionGroup.value.answers,
      type: this.questionType,
      date: new Date(),
      id: crypto.randomUUID(),
      answered: false,
      error: false
    }
    this.dataService.createQuestion(question);
  }

}
