import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  }


  loggedUser : User;

  currentPassword : string;
  newPassword : string;
  newPassword2 : string;

  passwordRegex1 = /[a-z](?=.*\d)(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,11}/
  passwordRegex2 = /[A-Z](?=.*\d)(?=.*[a-z])(?=.*[@#$%^&+=]).{6,11}/
  message : string = '';


  changePassword() {
    if (this.loggedUser.temppass != null ) {
      if (this.currentPassword != this.loggedUser.temppass) {
        this.message = "Incorrect current password.";
        return;
      }
    }
    else {
      if (this.currentPassword != this.loggedUser.password) {
        this.message = "Incorrect current password.";
        return;
      }
    }

    
    if (!this.passwordRegex1.test(this.newPassword)) {
      this.message = "New password is not in the valid format.";
    }
    else if (this.newPassword != this.newPassword2) {
      this.message = "New passwords don't match.";
    }
    else {
      this.message = '';

      this.usersService.changePassword(this.loggedUser.username, this.newPassword).subscribe(resp=>{
        if (resp['message']=='success') {
          console.log('Successfully changed password!');

          this.logout();
        }
      })
    }
  }

  logout() {
    localStorage.clear();
    if (this.loggedUser.type=='admin') this.router.navigate(['../adminLogin'])
    else this.router.navigate(['']);
  }
}
