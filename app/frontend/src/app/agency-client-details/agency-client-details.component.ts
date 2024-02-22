import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Client } from '../models/client';
import { UsersService } from '../services/users.service';
import { ClientsService } from '../services/clients.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agency-client-details',
  templateUrl: './agency-client-details.component.html',
  styleUrls: ['./agency-client-details.component.css']
})
export class AgencyClientDetailsComponent implements OnInit {

  constructor(private usersService: UsersService, private clientsService: ClientsService, private router: Router) { }

  ngOnInit(): void {
    this.clientUsername = JSON.parse(localStorage.getItem('selectedClient'))
    

    this.usersService.findUser(this.clientUsername).subscribe((data : User)=>{
      this.selectedUser = data;

      this.clientsService.getClient(this.clientUsername).subscribe((data : Client)=>{
        this.selectedClient = data;
        
        this.usersService.getProfilePhoto(this.selectedClient.username).subscribe(resp=>{
          this.selectedClient.photobase64 = this.photoPrefix + resp['base64'];
        })
      })
    })    
  }

  photoPrefix : string = "data:image/jpeg;base64,";
  clientUsername : string;
  selectedUser : User = new User();
  selectedClient : Client = new Client();


  close() {
    this.router.navigate(['agencyJobs'])
  }

  logout() {
    localStorage.clear();
  }
}
