import { Component, OnInit } from '@angular/core';
import { AgenciesService } from '../services/agencies.service';
import { Agency } from '../models/agency';
import { Comment } from '../models/comment';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-client-agency-details',
  templateUrl: './client-agency-details.component.html',
  styleUrls: ['./client-agency-details.component.css']
})
export class ClientAgencyDetailsComponent implements OnInit {

  constructor(private agenciesService: AgenciesService, private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.selectedAgency = JSON.parse(localStorage.getItem('selectedAgency'));

    this.agenciesService.getComments(this.selectedAgency.username).subscribe((data : Comment[])=>{
      this.comments = data;

      this.comments.forEach(c=>{
        this.usersService.getProfilePhoto(c.username).subscribe(resp=>{
          c.photobase64 = this.photoPrefix + resp['base64'];
        }) 
      })
    })
  }


  selectedAgency : Agency;
  comments : Comment[] = [];
  photoPrefix : string = "data:image/jpeg;base64,";


  hire() {
    this.router.navigate(['clientAgencyHire']);
  }

  
  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
