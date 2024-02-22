import { Component, OnInit } from '@angular/core';
import { AgenciesService } from '../services/agencies.service';
import { Router } from '@angular/router';
import { Agency } from '../models/agency';
import { User } from '../models/user';

@Component({
  selector: 'app-agency-add-worker',
  templateUrl: './agency-add-worker.component.html',
  styleUrls: ['./agency-add-worker.component.css']
})
export class AgencyAddWorkerComponent implements OnInit {

  constructor(private agenciesService: AgenciesService, private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    this.agenciesService.getAgency(this.loggedUser.username).subscribe((data : Agency)=>{
      this.agency = data;
    })
  }

  
  loggedUser : User;
  agency : Agency = new Agency();

  newFirstname : string = '';
  newLastname : string = '';
  newPhone : string = '';
  newMail : string = '';
  newField : string = '';

  phoneRegex = /\d{2,6}-\d{2,4}-\d{3,4}/
  mailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
  stringRegex = /^[a-zA-Z]+$/
  message : string = '';


  add() {
    // 1) Check valid firstname
    if (this.newFirstname == '' || !this.stringRegex.test(this.newFirstname)) {
      this.message = "Must enter firstname (letters only)."
    }
    // 2) Check valid lastname
    else if (this.newLastname == '' || !this.stringRegex.test(this.newLastname)) {
      this.message = "Must enter lastname (letters only)."
    }
    // 3) Check valid phone
    else if (this.newPhone == '' || !this.phoneRegex.test(this.newPhone)) {
      this.message = "Must enter phone number in the valid format."
    }
    // 4) Check valid mail
    else if (!this.mailRegex.test(this.newMail)) {
      this.message = "Must enter valid mail."
    }
    // 5) Check valid field
    else if (this.newField == '' || !this.stringRegex.test(this.newField)) {
      this.message = "Must enter field (letters only)."
    }
    else {
      this.agenciesService.addWorker(this.agency.username, this.newFirstname, this.newLastname, this.newPhone, this.newMail, this.newField).subscribe(resp=>{
        this.router.navigate(['agencyWorkers']);
      })
    }
  }

  cancel() {
    this.router.navigate(['agencyWorkers']);
  }
  
  logout() {
    localStorage.clear();
  }
}
