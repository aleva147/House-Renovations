import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private usersService: UsersService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  // Login data for all users:
  username : string = '';
  password : string;
  password2 : string;
  phone : string;
  mail : string;
  type : string;

  // Login data for clients:
  firstname : string = '';
  lastname : string = '';
  
  // Login data for agencies:
  name : string = '';
  country : string = '';
  city : string = '';
  street : string = '';
  identification : string;
  description : string;

  // Variables for correction:
  message : string = '';
  showPasswordError : boolean; 
  passwordRegex1 = /[a-z](?=.*\d)(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,11}/
  passwordRegex2 = /[A-Z](?=.*\d)(?=.*[a-z])(?=.*[@#$%^&+=]).{6,11}/
  phoneRegex = /\d{2,6}-\d{2,4}-\d{3,4}/
  mailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
  stringRegex = /^[a-zA-Z]+$/
  streetRegex = /(?=.*\d)(?=.*[A-Za-z])/
  identificationRegex = /\d{6}/

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




  register() {
    this.showPasswordError = false;

    if (this.username.length == 0) {
      this.message = "Must enter username.";
    }
    else {
      // 1) Check if username is unique
      this.usersService.findUserInclRegReqs(this.username).subscribe(res=>{
        if (res != null) {
          this.message = "Username already exists."
        }
        else {
          // 2) Check if mail is unique:
          this.usersService.findUserWithMailInclRegReqs(this.mail).subscribe(res=>{
            if (res != null) {
              this.message = "Email already used."
            }
            else {
              // 3) Check password format
              if(!(this.passwordRegex1.test(this.password) || this.passwordRegex2.test(this.password))) {
                this.showPasswordError = true;
                this.message = '';
              }
              // 4) Check matching passwords
              else if (this.password2 != this.password) {
                this.message = "Passwords aren't matching."
              }
              // 5) Check phone
              else if (!this.phoneRegex.test(this.phone)) {
                this.message = "Invalid phone format. Examples of expected formats: 'xx-xxx-xxxx', 'xxx-xxx-xxxx', 'xxx-xxxx-xxxx'..."
              }
              // 6) Check mail format:
              else if (!this.mailRegex.test(this.mail)) {
                this.message = "Invalid mail format."
              }
              // 7) Firstname:
              else if (this.type == 'client' && (!this.stringRegex.test(this.firstname) || this.firstname == '')) {
                this.message = "Must enter firstname (letters only)."
              }
              // 7) Lastname:
              else if (this.type == 'client' && (!this.stringRegex.test(this.lastname) || this.lastname == '')) {
                this.message = "Must enter lastname (letters only)."
              }
              // 8) Agency name:
              else if (this.type == 'agency' && this.name == '') {
                this.message = "Must enter agency name."
              }
              // 8) Check for address (country and city): 
              else if (this.type == 'agency' && !(this.stringRegex.test(this.country) && this.stringRegex.test(this.city))){
                this.message = "Must country and city (letters only)."
              } 
              // 8) Check street number format:
              else if (this.type == 'agency' && !this.streetRegex.test(this.street)){
                this.message = "Invalid street number. Expected at least one letter and one digit."
              } 
              // 8) Check identification format:
              else if (this.type == 'agency' && !this.identificationRegex.test(this.identification)) {
                this.message = "Invalid identification. Expected 6 digits."
              }
              else {
                this.message = ""

                // 9) Upload the image (or set it to default)
                this.http.post('http://localhost:4000/upload', this.fd).subscribe((result : string) => {

                  let photoname = result; 

                  // 10) Add the registration request to base.
                  if (this.type == "client") {
                    this.name = null; this.country = null; this.city = null;
                    this.street = null; this.identification = null; this.description = null;
                  }
                  else {
                    this.firstname = null; this.lastname = null;
                  }

                  this.usersService.sendRegRequest(this.username, this.password, this.phone, this.mail,
                    this.type, photoname, this.firstname, this.lastname, this.name, this.country,
                    this.city, this.street, this.identification, this.description).subscribe(resp=>{
                      
                      if (resp['message']=='success') {
                        console.log('Registered.');
                      }

                      this.router.navigate(['']);

                    })
                });
              }
            } 
          }) 
        }
      })
    }
  }

}
