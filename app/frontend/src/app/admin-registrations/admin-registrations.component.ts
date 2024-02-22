import { Component, OnInit } from '@angular/core';
import { RegRequest } from '../models/regRequest';
import { AdminsService } from '../services/admins.service';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-admin-registrations',
  templateUrl: './admin-registrations.component.html',
  styleUrls: ['./admin-registrations.component.css']
})
export class AdminRegistrationsComponent implements OnInit {

  constructor(private adminsService: AdminsService, private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.adminsService.getAllRegRequests().subscribe((data : RegRequest[])=>{
      this.allRegRequests = data;

      this.allRegRequests.forEach(r=>{
        if (r.status == 'pending') this.allPendingRequests.push(r)
        else if (r.status == 'approved') this.allApprovedRequests.push(r)
        else this.allRejectedRequests.push(r)

        this.usersService.getProfilePhotoWithPhotoname(r.photoname, r.type).subscribe(resp=>{
          r.photobase64 = this.photoPrefix + resp['base64'];
        })
      })

      this.selectedRequests = this.allPendingRequests;
    })
  }

  allRegRequests : RegRequest[] = [];
  allPendingRequests : RegRequest[] = [];
  allApprovedRequests : RegRequest[] = [];
  allRejectedRequests : RegRequest[] = [];
  photoPrefix : string = 'data:image/jpeg;base64,';
  
  status : string = 'pending';
  selectedRequests : RegRequest[] = [];


  filtered(status) {
    if (status=='pending') this.selectedRequests = this.allPendingRequests;
    else if (status=='approved') this.selectedRequests = this.allApprovedRequests;
    else if (status=='rejected') this.selectedRequests = this.allRejectedRequests;
  }

  approve(regReq) {
    regReq.status = 'approved'

    // Save status to db and add a new client/agency:
    this.adminsService.changeRegRequestStatus(regReq.id, 'approved').subscribe(resp=>{

      if (regReq.type == 'client') {
        this.usersService.addClient(regReq.username, regReq.password, regReq.phone, regReq.mail, regReq.photoname, regReq.firstname, regReq.lastname).subscribe(resp=>{
          if (resp['message']=='success') console.log('success');
        })
      }
      else if (regReq.type == 'agency') {
        this.usersService.addAgency(regReq.username, regReq.password, regReq.phone, regReq.mail, regReq.photoname, 
          regReq.name, regReq.country, regReq.city, regReq.street, regReq.identification, regReq.description).subscribe(resp=>{
          if (resp['message']=='success') console.log('success');
        })
      }

      // Refresh
      this.allPendingRequests = [];
      this.allApprovedRequests = [];
      this.allRejectedRequests = [];
      this.ngOnInit();
    })

  }
  reject(regReq) {
    regReq.status = 'rejected'
  
    // Save status to db:
    this.adminsService.changeRegRequestStatus(regReq.id, 'rejected').subscribe(resp=>{
      if (resp['message']=='success') console.log('success');

      // Refresh
      this.allPendingRequests = [];
      this.allApprovedRequests = [];
      this.allRejectedRequests = [];
      this.ngOnInit();
    })
  }

  
  logout() {
    localStorage.clear();
  }
}
