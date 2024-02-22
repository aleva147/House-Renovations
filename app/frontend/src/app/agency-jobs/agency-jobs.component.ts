import { Component, OnInit } from '@angular/core';
import { Agency } from '../models/agency';
import { AgenciesService } from '../services/agencies.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Job } from '../models/job';

@Component({
  selector: 'app-agency-jobs',
  templateUrl: './agency-jobs.component.html',
  styleUrls: ['./agency-jobs.component.css']
})
export class AgencyJobsComponent implements OnInit {

  constructor(private agenciesService: AgenciesService, private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    this.agenciesService.getNewRequests(this.loggedUser.username).subscribe((data : Job[])=>{
      this.newRequests = data;
      
    })

    this.agenciesService.getActiveJobs(this.loggedUser.username).subscribe((data : Job[])=>{
      this.activeJobs = data;      
    })
  }


  loggedUser : User;
  newRequests : Job[] = [];   // Jobs with type 'request' and status 'not seen'.
  activeJobs : Job[] = [];

  selectedRequest : Job;
  cost : number;

  error : boolean = false;
  message : string = '';
  numberRegex = /^\d+$/


  clientDetails(job) {
    localStorage.setItem('selectedClient', JSON.stringify(job.client));
  }

  viewObject(job) {
    localStorage.setItem('selectedObjectt', JSON.stringify(job.object));
  }
  
  accept(job) {
    this.message = '';
    this.cost = null;
    this.selectedRequest = job;
  }

  refuse(job) {
    this.agenciesService.refuseRequest(job.id).subscribe(resp=>{
      if (resp['message']=='ok') console.log('Accepted request')

      // Refresh
      this.agenciesService.getNewRequests(this.loggedUser.username).subscribe((data : Job[])=>{
        this.newRequests = data;
      })
    })
  }

  sendOffer() {
    if (this.cost == null || !this.numberRegex.test(this.cost.toString())) {
      this.error = true;
      this.message = "Invalid cost.";
      return;
    }
    this.error = false;
    this.message = 'Successfully sent.';

    // Update status from 'not seen' to 'accepted'
    this.agenciesService.acceptRequest(this.selectedRequest.id, this.cost).subscribe(resp=>{
      if (resp['message']=='success') console.log('Accepted request')

      // Refresh
      this.agenciesService.getNewRequests(this.loggedUser.username).subscribe((data : Job[])=>{
        this.newRequests = data;
      })
      this.selectedRequest = null;
    })
  }

  work(request : Job) {
    localStorage.setItem('selectedJob', JSON.stringify(request));
    this.router.navigate(['agencyJobsWork']);
  }


  logout() {
    localStorage.clear();
  }

}
