import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Job } from '../models/job';
import { AgenciesService } from '../services/agencies.service';
import { Router } from '@angular/router';
import { AdminsService } from '../services/admins.service';

@Component({
  selector: 'app-admin-jobs',
  templateUrl: './admin-jobs.component.html',
  styleUrls: ['./admin-jobs.component.css']
})
export class AdminJobsComponent implements OnInit {

  constructor(private agenciesService: AgenciesService, private adminsService:AdminsService, private router: Router) { }

  ngOnInit(): void {
    this.adminsService.getAllActiveJobs().subscribe((data : Job[])=>{
      this.activeJobs = data;      
    })

    this.adminsService.getAllFinishedJobs().subscribe((data : Job[])=>{
      this.finishedJobs = data;      
    })
  }


  activeJobs : Job[] = [];
  finishedJobs : Job[] = [];

  selectedJob : Job = new Job();


  clientDetails(job) {
    localStorage.setItem('selectedClient', JSON.stringify(job.client));
  }

  viewObject(job) {
    localStorage.setItem('selectedObjectt', JSON.stringify(job.object));
  }


  viewProgress(request : Job) {
    localStorage.setItem('selectedJob', JSON.stringify(request));
    this.router.navigate(['adminJobsProgress']);
  }

  viewTermination(job : Job) {
    this.selectedJob = job;
  }

  // Set status to 'not seen'. Close modal. Update page.
  declineTermination() {
    this.adminsService.declineTermination(this.selectedJob.id).subscribe(resp=>{
      if (resp['message']=='success') console.log('Successfully declined termination.');
      
      // Refresh:
      this.adminsService.getAllActiveJobs().subscribe((data : Job[])=>{
        this.activeJobs = data;      
      })
  
    })
  }

  // Set type to finished and status to terminated. Close modal. Update page.
  acceptTermination() {
    this.adminsService.acceptTermination(this.selectedJob.id).subscribe(resp=>{
      if (resp['message']=='success') console.log('Successfully accepted termination.');
      
      // Refresh:
      this.adminsService.getAllActiveJobs().subscribe((data : Job[])=>{
        this.activeJobs = data;      
      })
      this.adminsService.getAllFinishedJobs().subscribe((data : Job[])=>{
        this.finishedJobs = data;      
      })
    })
  }

  logout() {
    localStorage.clear();
  }
}
