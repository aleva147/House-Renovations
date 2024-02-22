import { Component, OnInit } from '@angular/core';
import { AgenciesService } from '../services/agencies.service';
import { AdminsService } from '../services/admins.service';
import { Router } from '@angular/router';
import { Agency } from '../models/agency';
import { Worker } from '../models/worker';
import { ReqWorkers } from '../models/reqWorkers';

@Component({
  selector: 'app-admin-agency-workers',
  templateUrl: './admin-agency-workers.component.html',
  styleUrls: ['./admin-agency-workers.component.css']
})
export class AdminAgencyWorkersComponent implements OnInit {

  constructor(private agenciesService: AgenciesService, private adminsService: AdminsService, private router: Router) { }

  ngOnInit(): void {
    this.selectedAgency = JSON.parse(localStorage.getItem('selectedAgency'));

    this.agenciesService.getAllWorkers(this.selectedAgency.username).subscribe((data : Worker[])=>{
      this.allWorkers = data;
      this.workersCnt = this.allWorkers.length;

      this.adminsService.getAllReqWorkers(this.selectedAgency.username).subscribe((data : ReqWorkers[])=>{
        this.allWorkersRequests = data;
      })
    })
  }


  selectedAgency : Agency = new Agency();
  allWorkers : Worker[] = [];
  workersCnt : number;

  allWorkersRequests : ReqWorkers[] = [];

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
      this.selectedAgency.openPositions += 1;
      localStorage.setItem('selectedAgency', JSON.stringify(this.selectedAgency));

      this.agenciesService.getAllWorkers(this.selectedAgency.username).subscribe((data : Worker[])=>{
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
          this.agenciesService.getAllWorkers(this.selectedAgency.username).subscribe((data : Worker[])=>{
            this.allWorkers = data;
          })

          this.editMode = false;
          this.selectedWorker = null;
          this.message = '';
      })
    }
  }


  addWorker() {
    this.router.navigate(['adminAddWorker'])
  }


  approve(reqWorker) {
    this.agenciesService.changeOpenPositions(this.selectedAgency.username, reqWorker.amount).subscribe(resp=>{
      if (resp['message']=='success') {
        console.log('Successfully changed open positions by ' + reqWorker.amount);

        this.adminsService.removeReqWorkers(reqWorker.id).subscribe(resp=>{
          if (resp['message']=='success') {
            console.log('Successfully removed workers request.')
    
            // Refresh:
            this.adminsService.getAllReqWorkers(this.selectedAgency.username).subscribe((data : ReqWorkers[])=>{
              this.allWorkersRequests = data;

              this.selectedAgency.openPositions = reqWorker.amount;
              localStorage.setItem('selectedAgency', JSON.stringify(this.selectedAgency));
            })
          }
        })
      }
    })
  }
  reject(reqWorker) {
    this.adminsService.removeReqWorkers(reqWorker.id).subscribe(resp=>{
      if (resp['message']=='success') {
        console.log('Successfully removed workers request.')

        // Refresh:
        this.adminsService.getAllReqWorkers(this.selectedAgency.username).subscribe((data : ReqWorkers[])=>{
          this.allWorkersRequests = data;
        })
      }
    })
  }


  logout() {
    localStorage.clear();
  }
}
