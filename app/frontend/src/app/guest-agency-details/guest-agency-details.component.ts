import { Component, OnInit } from '@angular/core';
import { Agency } from '../models/agency';
import { Comment } from '../models/comment';
import { AgenciesService } from '../services/agencies.service';

@Component({
  selector: 'app-guest-agency-details',
  templateUrl: './guest-agency-details.component.html',
  styleUrls: ['./guest-agency-details.component.css']
})
export class GuestAgencyDetailsComponent implements OnInit {

  constructor(private agenciesService: AgenciesService) { }

  ngOnInit(): void {
    this.selectedAgency = JSON.parse(localStorage.getItem('selectedAgency'));

    this.agenciesService.getComments(this.selectedAgency.username).subscribe((data : Comment[])=>{
      this.comments = data;
    })
  }

  selectedAgency : Agency;
  comments : Comment[] = [];
}
