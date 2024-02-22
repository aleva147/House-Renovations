import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
  }


  // For errors
  message : string;

  // For login
  username : string;
  password : string;

  // For forgoten password
  userEmail : string;
  mailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
  message2 : string;


  login() {
    this.usersService.login(this.username, this.password).subscribe(resp => {
      console.log("went to base");

      let userFromDB : User = resp['user'];
      let msg : string = resp['message'];

      if (userFromDB) {
        console.log("found user");
        
        localStorage.setItem('loggedUser', JSON.stringify(userFromDB));

        if (userFromDB.type == "client") {
          this.router.navigate(['client']);
        }
        else if (userFromDB.type == "agency") {
          this.router.navigate(['agency']);
        }
        else {
          this.message = "Error: No such user found.";
        }
      }
      else if (msg == 'toolate') {
        console.log("too late");
        this.message = "Error: This password is not valid anymore, 10mins have passed.";
      }
      else if (msg == 'oldpassword') {
        console.log("old password");
        this.message = "Error: This password has been changed and is not valid anymore.";
      }
      else {
        console.log("no user");
        this.message = "Error: No such user found.";
      }
    })
  }

  sendEmail() {
    // Check mail format:
    if (!this.mailRegex.test(this.userEmail)) {
      this.message2 = "Invalid mail format."
    }
    else {
      this.usersService.sendEmail(this.userEmail).subscribe(resp => {
        if (resp['message']=='success') {
        this.message2 = "New password has been successfully sent to your email.";
        }
        else {
          this.message2 = 'There was an error when trying to send an email...';
        }
      })
    }
  }

  close() {
    this.message2 = '';
  }
}
