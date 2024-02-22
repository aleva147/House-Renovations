import { Component, OnInit } from '@angular/core';
import { AgenciesService } from '../services/agencies.service';
import { Router } from '@angular/router';
import { Agency } from '../models/agency';

@Component({
  selector: 'app-admin-add-worker',
  templateUrl: './admin-add-worker.component.html',
  styleUrls: ['./admin-add-worker.component.css']
})
export class AdminAddWorkerComponent implements OnInit {

  constructor(private agenciesService: AgenciesService, private router: Router) { }

  ngOnInit(): void {
    this.selectedAgency = JSON.parse(localStorage.getItem('selectedAgency'));
  }

  
  selectedAgency : Agency;

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
      this.agenciesService.addWorker(this.selectedAgency.username, this.newFirstname, this.newLastname, this.newPhone, this.newMail, this.newField).subscribe(resp=>{
        if (resp['message']=='success') {
          this.selectedAgency.openPositions--;
          localStorage.setItem('selectedAgency', JSON.stringify(this.selectedAgency));
          
          this.router.navigate(['adminAgencyWorkers']);
        }
      })
    }
  }

  cancel() {
    this.router.navigate(['adminAgencyWorkers']);
  }
  
  logout() {
    localStorage.clear();
  }
}
