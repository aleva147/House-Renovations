import { Component, OnInit } from '@angular/core';
import { AgenciesService } from '../services/agencies.service';
import { User } from '../models/user';
import { Worker } from '../models/worker';
import { Agency } from '../models/agency';
import { Router } from '@angular/router';
import { AdminsService } from '../services/admins.service';

@Component({
  selector: 'app-agency-workers',
  templateUrl: './agency-workers.component.html',
  styleUrls: ['./agency-workers.component.css']
})
export class AgencyWorkersComponent implements OnInit {

  constructor(private agenciesService: AgenciesService, private adminsService: AdminsService, private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    this.agenciesService.getAllWorkers(this.loggedUser.username).subscribe((data : Worker[])=>{
      this.allWorkers = data;
      this.workersCnt = this.allWorkers.length;

      this.agenciesService.getAgency(this.loggedUser.username).subscribe((data : Agency)=>{
        this.agency = data;
      })
    })
  }


  agency : Agency = new Agency();
  loggedUser : User;
  allWorkers : Worker[] = [];
  workersCnt : number;

  selectedWorker : Worker;
  editMode : boolean = false;
  newFirstname : string;
  newLastname : string;
  newPhone : string;
  newMail : string;
  newField : string;

  phoneRegex = /\d{2,6}-\d{2,4}-\d{3,4}/
  mailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
  stringRegex = /^[a-zA-Z]+$/
  message : string = '';

  moreSpaces : number;
  applied : boolean = false;


  edit(worker) {
    this.editMode = true;
    this.selectedWorker = worker;
    this.newFirstname = this.selectedWorker.firstname;
    this.newLastname = this.selectedWorker.lastname;
    this.newPhone = this.selectedWorker.phone;
    this.newMail = this.selectedWorker.mail;
    this.newField = this.selectedWorker.field;
  }

  remove(worker) {
    this.selectedWorker = worker;
  }

  removeConfirmed() {
    this.agenciesService.removeWorker(this.selectedWorker.agency, this.selectedWorker.id).subscribe(resp => {
      // Refresh:
      this.agency.openPositions += 1;
      this.agenciesService.getAllWorkers(this.loggedUser.username).subscribe((data : Worker[])=>{
        this.allWorkers = data;
        this.selectedWorker = null;
      })
    })
  }

  editConfirmed() {
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
      this.agenciesService.updateWorker(this.selectedWorker.agency, this.selectedWorker.id, this.newFirstname, this.newLastname,
        this.newPhone, this.newMail, this.newField).subscribe(resp=>{
          // Refresh:
          this.agenciesService.getAllWorkers(this.loggedUser.username).subscribe((data : Worker[])=>{
            this.allWorkers = data;
          })

          this.editMode = false;
          this.selectedWorker = null;
          this.message = '';
      })
    }
  }

  applyForSpaces() {
    this.adminsService.addReqWorkers(this.agency.username, this.moreSpaces).subscribe(resp=>{
      if (resp['message']=='success') {
        console.log('successfully sent.')
        this.applied = true;
      }
    })
  }

  addWorker() {
    this.router.navigate(['agencyAddWorker'])
  }

  logout() {
    localStorage.clear();
  }
}
