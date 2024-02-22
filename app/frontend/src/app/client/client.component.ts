import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UsersService } from '../services/users.service';
import { ClientsService } from '../services/clients.service';
import { Client } from '../models/client';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  constructor(private usersService: UsersService, private clientsService: ClientsService, private http: HttpClient,
              private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'))

    this.clientsService.getClient(this.loggedUser.username).subscribe((data : Client)=>{
      this.client = data;

      this.usersService.getProfilePhoto(this.client.username).subscribe(resp=>{
        this.client.photobase64 = this.photoPrefix + resp['base64'];
      })
    })    
  }

  
  photoPrefix : string = "data:image/jpeg;base64,";
  loggedUser : User;
  client : Client = new Client();

  newFirstname : string = '';
  newLastname : string = '';
  newPhone : string = '';
  newMail : string = '';
  editMode : boolean = false;

  phoneRegex = /\d{2,6}-\d{2,4}-\d{3,4}/
  mailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
  stringRegex = /^[a-zA-Z]+$/

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
    this.newFirstname = this.client.firstname;
    this.newLastname = this.client.lastname;
    this.newPhone = this.loggedUser.phone;
    this.newMail = this.loggedUser.mail;
  }

  confirm() {
    // 1) Check valid firstname
    if (this.newFirstname == '' || !this.stringRegex.test(this.newFirstname)) {
      this.message = "Must enter firstname (letters only)."
    }
    // 2) Check valid lastname
    else if (this.newLastname == '' || !this.stringRegex.test(this.newLastname)) {
      this.message = "Must enter lastname (letters only)."
    }
    // 3) Check valid phone
    else if (this.newPhone == '' || !this.phoneRegex.test(this.newPhone)) {
      this.message = "Must enter phone number in the valid format."
    }
    // 4) Check valid mail
    else if (!this.mailRegex.test(this.newMail)) {
      this.message = "Must enter valid mail."
    }
    else {
      // 5) Check if newMail already exists in database 
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
            this.clientsService.updateClient(this.loggedUser.username, this.newFirstname, this.newLastname, this.newPhone, this.newMail, newPhotoname).subscribe(resp=>{
                if (resp['message']=='success') {
                  // Refresh with new data:
                  this.loggedUser.phone = this.newPhone;
                  this.loggedUser.mail = this.newMail;
                  this.loggedUser.photoname = newPhotoname;
                  this.client.firstname = this.newFirstname;
                  this.client.lastname = this.newLastname;

                  this.usersService.getProfilePhoto(this.client.username).subscribe(resp=>{
                    this.client.photobase64 = this.photoPrefix + resp['base64'];
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
