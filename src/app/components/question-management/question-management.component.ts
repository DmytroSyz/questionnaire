import {Component, OnInit} from '@angular/core';
import {DataService, IQuestion} from "../../services/data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-question-management',
  templateUrl: './question-management.component.html',
  styleUrls: ['./question-management.component.scss']
})
export class QuestionManagementComponent implements OnInit {

  public displayedColumns: string[] = ['text', 'type', 'date', 'edit', 'delete'];
  public dataSource: IQuestion[];

  constructor(private dataService: DataService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.dataService.questions$.subscribe((res: IQuestion[]) => {
      this.dataSource = res.sort((a, b) =>
        Date.parse(b.date.toString()) - Date.parse(a.date.toString()));
    })
  }

  public createQuestion(): void {
    this.router.navigate(['/create'])
  }

  public deleteQuestion(id: string): void {
    this.dataService.deleteQuestion(id);
  }

  public editQuestion(question: IQuestion): void {
    localStorage.setItem('editedQuestion', JSON.stringify(question));
    this.dataService.editedQuestion.next(question);
    this.router.navigate(['/edit']);
  }

}
