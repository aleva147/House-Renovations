import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  
  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
  }

  message : string;

  username : string = '';
  password : string = '';

  // For forgoten password
  userEmail : string;
  mailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
  message2 : string;


  adminLogin() {
    if (this.username == '' || this.password == '') {
      this.message = "Must enter username and password";
    }
      else {
      this.usersService.login(this.username, this.password).subscribe(resp => {
        let userFromDB : User = resp['user'];
        
        if (userFromDB != null) {
          localStorage.setItem('loggedUser', JSON.stringify(userFromDB));

          if (userFromDB.type == "admin") {
            this.router.navigate(['adminUsers']);
          }
          else {
            this.message = "Error: No such user found.";
          }
        }
        else {
          this.message = "Error: No such user found.";
        }
      })
    }
  }

  sendEmail() {
    // 6) Check mail format:
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
