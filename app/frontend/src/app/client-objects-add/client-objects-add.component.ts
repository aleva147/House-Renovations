import { Component, OnInit } from '@angular/core';
import { ObjecttsService } from '../services/objectts.service';
import { Router } from '@angular/router';
import { Objectt } from '../models/objectt';
import { User } from '../models/user';
import { Room } from '../models/room';

@Component({
  selector: 'app-client-objects-add',
  templateUrl: './client-objects-add.component.html',
  styleUrls: ['./client-objects-add.component.css']
})
export class ClientObjectsAddComponent implements OnInit {

  constructor(private objecttsService: ObjecttsService, private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  }


  loggedUser : User;

  type : string = 'house';
  country : string = '';
  city : string = '';
  street : string = '';
  numOfRooms : number;
  sqFootage : number;

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
      let rooms : Room[] = this.createDefaultSketch(this.numOfRooms);

      this.objecttsService.addObjectt(this.loggedUser.username, this.type, address, this.numOfRooms, this.sqFootage, rooms).subscribe((resp : number)=>{
        console.log('Added objectt to db.');
        let id : number = resp;

        localStorage.setItem('newObjecttId', JSON.stringify(id));

        this.router.navigate(['clientObjectsAddSketch'])
      })
    }
  }

  
  // Create default sketch:
  createDefaultSketch(numOfRooms) {
    let rooms : Room[] = [];

    // Default sketch for 1 room:
    if (numOfRooms == 1) {
      rooms.push(new Room(100, 35, 100, 50, "bottom", 45))
    }
    // Default sketch for 2 rooms:
    else if (numOfRooms == 2) {
      rooms.push(new Room(80, 35, 100, 50, "bottom", 45))
      rooms.push(new Room(180, 35, 55, 50, "left", 20))
    }
    // Default sketch for 3 rooms:
    else {
      rooms.push(new Room(80, 10, 100, 50, "bottom", 45))
      rooms.push(new Room(180, 10, 55, 50, "bottom", 17.5))
      rooms.push(new Room(120, 60, 100, 50, "bottom", 45))
    }

    return rooms;
  }

  cancel() {
    this.router.navigate(['clientObjects']);
  }
  




  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }


}
