import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgenciesService } from '../services/agencies.service';
import { UsersService } from '../services/users.service';
import { Agency } from '../models/agency';

@Component({
  selector: 'app-client-agencies',
  templateUrl: './client-agencies.component.html',
  styleUrls: ['./client-agencies.component.css']
})
export class ClientAgenciesComponent implements OnInit {

  constructor(private agenciesService: AgenciesService, private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.agenciesService.getAll().subscribe((data : Agency[])=>{
      this.allAgencies = data;

      this.allAgencies.forEach(a=>{
        this.usersService.getProfilePhoto(a.username).subscribe(resp=>{
          a.photobase64 = this.photoPrefix + resp['base64'];
        })
      })
    })
  }

  photoPrefix : string = "data:image/jpeg;base64,";
  allAgencies : Agency[];

  searchParamName : string = '';
  searchParamCountry : string = '';
  searchParamCity : string = '';
  searchParamStreet : string = '';

  search() {
    this.agenciesService.getAll().subscribe((data : Agency[])=>{
      this.allAgencies = data;

      this.allAgencies = this.allAgencies.filter(a => a.name.includes(this.searchParamName) 
                                                      && a.country.includes(this.searchParamCountry)
                                                      && a.city.includes(this.searchParamCity)
                                                      && a.street.includes(this.searchParamStreet))

      this.allAgencies.forEach(a=>{
        this.usersService.getProfilePhoto(a.username).subscribe(resp=>{
          a.photobase64 = this.photoPrefix + resp['base64'];
        })
      })
    })
  }

  sortByName(order) {
    this.allAgencies.sort((a1, a2)=>{
      if (order == 'a') {
        if (a1.name < a2.name)  return -1
        else if (a1.name == a2.name) return 0
        else return 1
      }
      else {
        if (a1.name > a2.name)  return -1
        else if (a1.name == a2.name) return 0
        else return 1
      }
    })
  }
  sortByCountry(order) {
    this.allAgencies.sort((a1, a2)=>{
      if (order == 'a') {
        if (a1.country < a2.country) return -1
        else if (a1.country == a2.country) return 0
        else return 1
      }
      else {
        if (a1.country > a2.country) return -1
        else if (a1.country == a2.country) return 0
        else return 1
      }
    })
  }
  sortByCity(order) {
    this.allAgencies.sort((a1, a2)=>{
      if (order == 'a') {
        if (a1.city < a2.city) return -1
        else if (a1.city == a2.city) return 0
        else return 1
      }
      else {
        if (a1.city > a2.city) return -1
        else if (a1.city == a2.city) return 0
        else return 1
      }
    })
  }
  sortByStreet(order) {
    this.allAgencies.sort((a1, a2)=>{
      if (order == 'a') {
        if (a1.street < a2.street) return -1
        else if (a1.street == a2.street) return 0
        else return 1
      }
      else {
        if (a1.street > a2.street) return -1
        else if (a1.street == a2.street) return 0
        else return 1
      }
    })
  }

  seeMore(agency) {
    localStorage.setItem('selectedAgency', JSON.stringify(agency));
  }


  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
