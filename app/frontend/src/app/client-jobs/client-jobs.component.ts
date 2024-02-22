import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientsService } from '../services/clients.service';
import { Job } from '../models/job';
import { User } from '../models/user';
import { ObjecttsService } from '../services/objectts.service';
import { Objectt } from '../models/objectt';
import { AgenciesService } from '../services/agencies.service';
import { Agency } from '../models/agency';
import { Comment } from '../models/comment';

@Component({
  selector: 'app-client-jobs',
  templateUrl: './client-jobs.component.html',
  styleUrls: ['./client-jobs.component.css']
})
export class ClientJobsComponent implements OnInit {

  constructor(private clientsService: ClientsService, private objecttsService: ObjecttsService, private agenciesService: AgenciesService,
    private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    this.clientsService.getRequests(this.loggedUser.username).subscribe((data : Job[])=>{
      this.allRequests = data;

      this.allRequests.forEach(r=>{
        this.objecttsService.getById(r.object).subscribe((obj : Objectt)=>{
          r.objectAddress = obj.address;
        })
        this.agenciesService.getAgency(r.agency).subscribe((ag : Agency)=>{
          r.agencyName = ag.name;
        })
      })
    })

    this.clientsService.getActiveJobs(this.loggedUser.username).subscribe((data : Job[])=>{
      this.allActive = data;

      this.allActive.forEach(r=>{
        this.objecttsService.getById(r.object).subscribe((obj : Objectt)=>{
          r.objectAddress = obj.address;
        })
        this.agenciesService.getAgency(r.agency).subscribe((ag : Agency)=>{
          r.agencyName = ag.name;
        })
      })
    })

    this.clientsService.getFinishedJobs(this.loggedUser.username).subscribe((data : Job[])=>{
      this.allFinished = data;

      this.allFinished.forEach(r=>{
        this.objecttsService.getById(r.object).subscribe((obj : Objectt)=>{
          r.objectAddress = obj.address;
        })
        this.agenciesService.getAgency(r.agency).subscribe((ag : Agency)=>{
          r.agencyName = ag.name;
        })
      })
    })
  }

  
  loggedUser : User;
  allRequests : Job[] = [];
  allActive : Job[] = [];
  allFinished : Job[] = [];

  type : string = 'request';

  // Leave a rating:
  selectedJob : Job;
  commentText : string;
  grade : number;
  existingComment : boolean = false;
  commentId : number;
  numberRegex = /^\d+$/;
  message : string = '';
  message2 : string = '';
  


  colorMe(status) {
    if (status == 'accepted') return 'color:green';
    else if (status == 'refused') return 'color:red';
    else return 'color:black';
  }

  acceptRequest(request) {
    this.clientsService.acceptRequest(request.id).subscribe(resp=>{
      if (resp['message']=='success') console.log('Successfully accepted offer.');
      
      // Refresh:
      this.ngOnInit();
    })
  }
  
  refuseRequest(request) {
    this.clientsService.refuseRequest(request.id).subscribe(resp=>{
      if (resp['message']=='success') console.log('Successfully deleted request.');
      
      // Refresh:
      this.ngOnInit();
    })
  }


  viewProgress(request : Job) {
    localStorage.setItem('selectedJob', JSON.stringify(request))
    this.router.navigate(['clientJobsProgress'])
  }


  rate(request : Job) {
    this.message = '';
    this.message2 = '';
    this.selectedJob = request;
    

    if (!request.comment) {
      this.existingComment = false;
      this.commentText = '';
      this.grade = null;
    }
    else {
      this.clientsService.getComment(request.comment).subscribe((comment : Comment)=>{
        this.existingComment = true;
        this.commentText = comment.text;
        this.grade = comment.grade;
        this.commentId = comment.id;
      })
    }
  }

  confirmRate() {
    this.message = '';
    this.message2 = '';

    if (this.commentText == '') this.message = "You must write a comment.";
    else if (!this.grade || !this.numberRegex.test(this.grade.toString()) || this.grade < 1 || this.grade > 10) this.message = "You must enter a valid grade.";
    else {
      if (!this.existingComment) {
        this.clientsService.createComment(this.selectedJob.client, this.selectedJob.agency, this.commentText, this.grade, this.selectedJob.id).subscribe((commentId:number)=>{
          this.selectedJob.comment = commentId;
          this.message2 = 'Rating successfully sent.'
          this.existingComment = true;
          this.commentId = commentId;
        })
      }
      else {
        this.clientsService.updateComment(this.commentId, this.commentText, this.grade).subscribe(resp=>{
          if (resp['message']=='success') console.log('Successfully edited comment.');
          this.message2 = 'Rating successfully edited.'
        })
      }
    }
  }

  removeRating() {
    this.clientsService.deleteComment(this.commentId, this.selectedJob.id).subscribe(resp=>{
      if (resp['message']=='success') console.log('Successfully deleted comment.');

      this.selectedJob.comment = null;
      this.existingComment = false;
      this.commentText = '';
      this.grade = null;
      this.message2 = 'Rating successfully removed.'
    })
  }


  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }

}
