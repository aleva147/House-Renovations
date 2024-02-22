import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.loggedUser = new User();
    this.loggedUser.type = 'none';

    const readUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (readUser) {
      this.loggedUser = readUser;
    }

    console.log(this.loggedUser.type);
  }


  loggedUser : User;
}
