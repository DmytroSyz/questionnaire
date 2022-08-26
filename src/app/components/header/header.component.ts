import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Route, Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public headerTitle: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
        switch (data.url) {
          case '/create':
            this.headerTitle = 'Create Question'
            break;
          case '/management':
            this.headerTitle = 'Question Management'
            break;
          case '/list':
            this.headerTitle = 'Lists of Questions'
            break;
          case '/edit':
            this.headerTitle = 'Question Edit'
            break;
        }
      }
    })
  }

}
