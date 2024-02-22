import { Component, OnInit } from '@angular/core';
import { ObjecttsService } from '../services/objectts.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Objectt } from '../models/objectt';

@Component({
  selector: 'app-client-objects-edit-object',
  templateUrl: './client-objects-edit-object.component.html',
  styleUrls: ['./client-objects-edit-object.component.css']
})
export class ClientObjectsEditObjectComponent implements OnInit {

  constructor(private objecttsService: ObjecttsService, private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    this.objectt = JSON.parse(localStorage.getItem('selectedObjectt'))
  }


  loggedUser : User;
  objectt : Objectt = JSON.parse(localStorage.getItem('selectedObjectt'))

  type : string = this.objectt.type;
  address : string = this.objectt.address;
  country : string = this.address.split(', ')[0];
  city : string = this.address.split(', ')[1];
  street : string = this.address.split(', ')[2];
  numOfRooms : number = this.objectt.numOfRooms;
  sqFootage : number = this.objectt.sqFootage;

  // Variables for correction:
  message : string = '';
  stringRegex = /^[a-zA-Z]+$/
  streetRegex = /(?=.*\d)(?=.*[A-Za-z])/
  numberRegex = /[\d]+/


  continue() {
    if (!this.stringRegex.test(this.country) || this.country == '') {
      this.message = "Must enter country (letters only)."
    }
    else if (!this.stringRegex.test(this.city) || this.city == '') {
      this.message = "Must enter city (letters only)."
    }
    else if (!this.streetRegex.test(this.street) || this.street == '') {
      this.message = "Invalid street. Expected at least one letter and one digit."
    }
    else if (!this.numberRegex.test(String(this.numOfRooms)) || this.numOfRooms < 1 || this.numOfRooms > 3) {
      this.message = "Invalid number of rooms. Expected a number in the range 1-3."
    } 
    else if (!this.numberRegex.test(String(this.sqFootage))) {
      this.message = "Invalid square footage. Expected a number."
    } 
    else {
      this.message = "";

      let address : string = this.country + ', ' + this.city + ', ' + this.street;

      this.objecttsService.updateObjecttInfo(this.objectt.id, this.type, address, this.numOfRooms, this.sqFootage).subscribe(resp =>{
        if (resp['message']=='success') console.log('Successfully edited object.');

        localStorage.setItem('newObjecttId', JSON.stringify(this.objectt.id));

        this.router.navigate(['clientObjectsAddSketch'])
      })
    }
  }

  cancel() {
    this.router.navigate(['clientObjects']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
