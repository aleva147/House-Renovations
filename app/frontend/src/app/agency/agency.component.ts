import { Component, OnInit } from '@angular/core';
import { Agency } from '../models/agency';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { AgenciesService } from '../services/agencies.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.css']
})
export class AgencyComponent implements OnInit {

  constructor(private usersService: UsersService, private agenciesService: AgenciesService, private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'))

    this.agenciesService.getAgency(this.loggedUser.username).subscribe((data : Agency)=>{
      this.agency = data;

      this.usersService.getProfilePhoto(this.agency.username).subscribe(resp=>{
        this.agency.photobase64 = this.photoPrefix + resp['base64'];
      })
    })    
  }

  photoPrefix : string = "data:image/jpeg;base64,";
  loggedUser : User;
  agency : Agency = new Agency();

  newName : string = '';
  newCountry : string = '';
  newCity : string = '';
  newStreet : string = '';
  newDescription : string = '';
  newPhone : string = '';
  newMail : string = '';
  editMode : boolean = false;

  phoneRegex = /\d{2,6}-\d{2,4}-\d{3,4}/
  mailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
  stringRegex = /^[a-zA-Z]+$/
  streetRegex = /(?=.*\d)(?=.*[A-Za-z])/

  message : string = '';


  // For file upload:
  selectedPhoto : File = null;
  fd = new FormData();
  messagePhoto : string = '';

  createPhotoData(event) {
    this.selectedPhoto = <File>event.target.files[0]; 
    
    console.log(this.selectedPhoto.type);
    if (this.selectedPhoto.type != 'image/jpeg' && this.selectedPhoto.type != 'image/png') {
      // Disables confirm button.
      this.messagePhoto = "You must select a JPEG/PNG file.";
    }
    else {
      // For checking image size:
      var reader = new FileReader();

      reader.onload = (event: any) => {
        let url = event.target.result;
        let img = new Image();

        img.onload = () => {
          var height = img.height;
          var width = img.width;
        
          console.log('width: ', width, 'height: ', height);
          if (width < 100 || width > 300 || height < 100 || height > 300) {
            // Disables confirm button.
            this.messagePhoto = "Image size must be in range from 100x100 to 300x300.";  
          }
          else {
            this.messagePhoto = "";
          }
        }

        img.src = url;
        
      };

      reader.readAsDataURL(event.target.files[0]);
      
      
      // Preparation for sending to server:
      this.fd = new FormData();   // Protects from unexpected behaviour when choosing a photo multiple times.
      this.fd.append('file', this.selectedPhoto, this.selectedPhoto.name);
    }
  }


  edit() {
    this.editMode = true;
    this.newName = this.agency.name;
    this.newCountry = this.agency.country;
    this.newCity = this.agency.city;
    this.newStreet = this.agency.street;
    this.newDescription = this.agency.description;
    this.newPhone = this.loggedUser.phone;
    this.newMail = this.loggedUser.mail;
  }

  confirm() {
    // 1) Check valid name
    if (this.newName == '') {
      this.message = "Must enter agency name."
    }
    // 2) Check valid address
    else if (this.newCountry == '' || !this.stringRegex.test(this.newCountry)) {
      this.message = "Must enter contry (letters only)."
    }
    // 2) Check valid address
    else if (this.newCity == '' || !this.stringRegex.test(this.newCity)) {
      this.message = "Must enter city (letters only)."
    }
    // 2) Check valid address
    else if (this.newStreet == '' || !this.streetRegex.test(this.newStreet)) {
      this.message = "Invalid street number. Expected at least one letter and one digit."
    }
    // 3) Check valid description
    else if (this.newDescription == '') {
      this.message = "Must enter description."
    }
    // 4) Check valid phone
    else if (this.newPhone == '' || !this.phoneRegex.test(this.newPhone)) {
      this.message = "Must enter phone number in the valid format."
    }
    // 5) Check valid mail
    else if (!this.mailRegex.test(this.newMail)) {
      this.message = "Must enter valid mail."
    }
    else {
      // 6) Check if newMail already exists in database 
      this.usersService.findUserWithMailInclRegReqs(this.newMail).subscribe(user => {
        if (user) {
          this.message = "Entered mail is already in use.";
        }
        else {
          this.message = ""
          this.editMode = false;

          // 6) Upload the image (or set it to default)
          this.http.post('http://localhost:4000/upload', this.fd).subscribe((result : string) => {

            let newPhotoname = result; 

            // 7) Update database
            this.agenciesService.updateAgency(this.loggedUser.username, this.newName, this.newCountry, this.newCity, this.newStreet, 
                                              this.newDescription, newPhotoname, this.newPhone, this.newMail).subscribe(resp=>{
                if (resp['message']=='success') {
                  // Refresh with new data:
                  this.loggedUser.phone = this.newPhone;
                  this.loggedUser.mail = this.newMail;
                  this.loggedUser.photoname = newPhotoname;
                  this.agency.name = this.newName;
                  this.agency.country = this.newCountry;
                  this.agency.city = this.newCity;
                  this.agency.street = this.newStreet;
                  this.agency.description = this.newDescription;

                  this.usersService.getProfilePhoto(this.agency.username).subscribe(resp=>{
                    this.agency.photobase64 = this.photoPrefix + resp['base64'];
                  })
                  
                  localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));  // Show updated information if the user reloads page.
                }
              })
          });
        }
      })
    }
  }

  logout() {
    localStorage.clear();
  }

  changePassword() {
    this.router.navigate(['changePassword'])
  }
}
