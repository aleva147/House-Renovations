import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Objectt } from '../models/objectt';
import { ObjecttsService } from '../services/objectts.service';
import { ClientsService } from '../services/clients.service';
import { Agency } from '../models/agency';

@Component({
  selector: 'app-client-agency-hire',
  templateUrl: './client-agency-hire.component.html',
  styleUrls: ['./client-agency-hire.component.css']
})
export class ClientAgencyHireComponent implements OnInit {

  constructor(private objecttsService: ObjecttsService, private clientsService: ClientsService, private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
    this.selectedAgency = JSON.parse(localStorage.getItem('selectedAgency'))

    this.objecttsService.getAllForClient(this.loggedUser.username).subscribe((data : Objectt[])=>{
      this.objectts = data;
    })
  }


  loggedUser : User;
  selectedAgency : Agency;
  objectts : Objectt[] = [];  

  selectedObject : number = null;
  startDate : string = new Date().toISOString().slice(0,10);
  endDate : string = new Date().toISOString().slice(0,10);
  today : string = new Date().toISOString().slice(0,10); 

  message : string = '';

  

  sendRequest() {
    if (!this.selectedObject) {
      this.message = 'You must select an object.';
    }
    else if (this.startDate < this.today) {
      this.message = 'You cannot chose a date from the past.';
    }
    else if (this.endDate < this.startDate) {
      this.message = 'Deadline must be after the starting date.'; 
    }
    else {
      this.message = '';
      console.log(this.selectedObject);
      
      this.objecttsService.getById(this.selectedObject).subscribe((obj : Objectt)=>{
        this.clientsService.sendJobRequest(this.loggedUser.username, this.selectedObject, this.selectedAgency.username,
          this.startDate, this.endDate, obj.sketch).subscribe(resp=>{
            if (resp['message']=='success') console.log('Successfully sent job request');
            
            this.router.navigate(['clientAgencyDetails']);
        })
      })
    }
  }

  cancel() {
    this.router.navigate(['clientAgencyDetails'])
  }

  logout() {
    localStorage.clear();
  }
}
