import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../models/client';
import { Agency } from '../models/agency';
import { ClientsService } from '../services/clients.service';
import { AgenciesService } from '../services/agencies.service';
import { UsersService } from '../services/users.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  constructor(private router: Router, private clientsService: ClientsService, private agenciesService: AgenciesService, private usersService: UsersService, private http: HttpClient) { }

  ngOnInit(): void {
    this.clientsService.getAll().subscribe((data : Client[])=>{
      this.allClients = data;

      this.agenciesService.getAll().subscribe((data : Agency[])=>{
        this.allAgencies = data;

        this.allClients.forEach(c=>{
          this.usersService.getProfilePhoto(c.username).subscribe(resp=>{
            c.photobase64 = this.photoPrefix + resp['base64'];
          })
        })

        this.allAgencies.forEach(a=>{
          this.usersService.getProfilePhoto(a.username).subscribe(resp=>{
            a.photobase64 = this.photoPrefix + resp['base64'];
          })
        })
      })
    })
  }


  type : string = 'clients';
  allClients : Client[] = [];
  allAgencies : Agency[] = [];
  photoPrefix = 'data:image/jpeg;base64,';

  editMode : boolean = false;
  selectedClient : Client = new Client();
  selectedAgency : Agency = new Agency();
  newFirstname : string = '';
  newLastname : string = '';
  newPhone : string = '';
  newMail : string = '';

  newName : string = '';
  newCountry : string = '';
  newCity : string = '';
  newStreet : string = '';
  newDescription : string = '';

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
      //console.log(this.selectedPhoto.name)
      this.fd = new FormData();   // Usled vise pokusaja biranja slike da append ne poremeti.
      this.fd.append('file', this.selectedPhoto, this.selectedPhoto.name);
    }
  }





  confirmClient() {
    this.message = ""

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
            this.clientsService.updateClient(this.selectedClient.username, this.newFirstname, this.newLastname, this.newPhone, this.newMail, newPhotoname).subscribe(resp=>{
                if (resp['message']=='success') {
                  // Refresh with new data:
                  this.clientsService.getAll().subscribe((data : Client[])=>{
                    this.allClients = data;

                    this.allClients.forEach(c=>{
                      this.usersService.getProfilePhoto(c.username).subscribe(resp=>{
                        c.photobase64 = this.photoPrefix + resp['base64'];
                      })
                    })
                  })
                }
              })
          });
        }
      })
    }
  }


  confirmAgency() {
    this.message = ""

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
            this.agenciesService.updateAgency(this.selectedAgency.username, this.newName, this.newCountry, this.newCity, this.newStreet, 
                                              this.newDescription, newPhotoname, this.newPhone, this.newMail).subscribe(resp=>{
                if (resp['message']=='success') {
                  // Refresh with new data:
                  this.agenciesService.getAll().subscribe((data : Agency[])=>{
                    this.allAgencies = data;

                    this.allAgencies.forEach(a=>{
                      this.usersService.getProfilePhoto(a.username).subscribe(resp=>{
                        a.photobase64 = this.photoPrefix + resp['base64'];
                      })
                    })
                  })
                }
              })
          });
        }
      })
    }
  }


  editClient(client) {
    this.editMode = true;
    this.newFirstname = client.firstname;
    this.newLastname = client.lastname;
    this.fd = new FormData();

    this.usersService.findUser(client.username).subscribe((user : User)=>{
      this.newPhone = user.phone;
      this.newMail = user.mail;
    })

    localStorage.setItem('selectedClient', JSON.stringify(client));
    this.selectedClient = client;
  }

  editAgency(agency) {
    this.editMode = true;
    this.newName = agency.name;
    this.newCountry = agency.country;
    this.newCity = agency.city;
    this.newStreet = agency.street;
    this.newDescription = agency.description;
    this.fd = new FormData();

    this.usersService.findUser(agency.username).subscribe((user : User)=>{
      this.newPhone = user.phone;
      this.newMail = user.mail;
    })

    this.selectedAgency = agency;
  }

  workers(agency) {
    localStorage.setItem('selectedAgency', JSON.stringify(agency));
    this.selectedAgency = agency;
  }
  

  
  removeClient(client) {
    this.selectedClient = client;
  }
  removeAgency(agency) {
    this.selectedAgency = agency;
  }

  removeConfirmed() {
    if (this.type == 'clients') {
      this.clientsService.remove(this.selectedClient.username).subscribe(resp => {
        // Refresh:
        this.clientsService.getAll().subscribe((data : Client[])=>{
          this.allClients = data;

          this.allClients.forEach(c=>{
            this.usersService.getProfilePhoto(c.username).subscribe(resp=>{
              c.photobase64 = this.photoPrefix + resp['base64'];
            })
          })
        })
      })
    }
    else {
      this.agenciesService.remove(this.selectedAgency.username).subscribe(resp => {
        // Refresh:
        this.agenciesService.getAll().subscribe((data : Agency[])=>{
          this.allAgencies = data;

          this.allAgencies.forEach(a=>{
            this.usersService.getProfilePhoto(a.username).subscribe(resp=>{
              a.photobase64 = this.photoPrefix + resp['base64'];
            })
          })
        })
      })
    }
  }


  addNew() {
    console.log(this.type);

    if (this.type=='clients') {
      this.router.navigate(['addNewClient'])
    }
    else {
      this.router.navigate(['addNewAgency'])
    }
  } 



  logout() {
    localStorage.clear();
  }
}
