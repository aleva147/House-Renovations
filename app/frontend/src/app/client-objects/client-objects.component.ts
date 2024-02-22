import { Component, OnInit } from '@angular/core';
import { ObjecttsService } from '../services/objectts.service';
import { Router } from '@angular/router';
import { Objectt } from '../models/objectt';
import { User } from '../models/user';
import { ClientsService } from '../services/clients.service';
import { Job } from '../models/job';

@Component({
  selector: 'app-client-objects',
  templateUrl: './client-objects.component.html',
  styleUrls: ['./client-objects.component.css']
})
export class ClientObjectsComponent implements OnInit {

  constructor(private objecttsService: ObjecttsService, private clientsService: ClientsService, private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    this.clientsService.getActiveJobs(this.loggedUser.username).subscribe((data : Job[])=>{
      let activeJobs = data;

      this.objecttsService.getAllForClient(this.loggedUser.username).subscribe((data : Objectt[])=>{
        this.allObjectts = data;
  
        this.allObjectts.forEach(o=>{
          activeJobs.forEach(j=>{
            if (j.object == o.id) o.workInProgress = true;
          })
        })
      })
    })
  }


  loggedUser : User;
  allObjectts : Objectt[];

  selectedObjectt : Objectt = new Objectt();

  // For file upload:
  jsonObject : {} = null; 
  message : string = 'No file selected.';
  error : boolean = true;


  addObjectt() {
    this.router.navigate(['clientObjectsAdd'])
  }

  close() {
    this.message = '';
    this.error = true;
    this.jsonObject = null;
  }

  
  onFileChanged(event) {
    let selectedFile = event.target.files[0];

    console.log(selectedFile.type);
    if (selectedFile.type != 'application/json') {
      this.message = "You must select a JSON file.";
      this.error = true;
    }
    else {
      const fileReader = new FileReader();
      fileReader.readAsText(selectedFile, "UTF-8");
      fileReader.onload = () => {
        this.jsonObject = (JSON.parse(fileReader.result.toString()));
        if (!this.jsonObject['client'] || !this.jsonObject['address'] || !this.jsonObject['type'] || !this.jsonObject['numOfRooms'] 
        || !this.jsonObject['sqFootage'] || !this.jsonObject['sketch']) {
          this.message = "This JSON file does not contain the necessary data!";
          this.error = true;
        }
        else {
          this.message = '';
          this.error = false;
        }
      }
      fileReader.onerror = (error) => {
        console.log(error);
      }
    }
  }

  upload() {
    this.objecttsService.uploadObjectt(this.jsonObject).subscribe(resp=>{
      if (resp['message']=='success') console.log('Successfully uploaded.');
      this.message = '';

      // Refresh:
      this.objecttsService.getAllForClient(this.loggedUser.username).subscribe((data : Objectt[])=>{
        this.allObjectts = data;
      })
    })
  }


  seeSketch(objectt) {
    localStorage.setItem('selectedObjectt', JSON.stringify(objectt));
  }

  editObjectt(objectt) {
    localStorage.setItem('selectedObjectt', JSON.stringify(objectt));
    this.router.navigate(['clientObjectsEditObject']);
  }


  remove(objectt) {
    this.selectedObjectt = objectt;
  }

  removeConfirmed() {
    this.objecttsService.remove(this.selectedObjectt.id).subscribe(resp => {
      if (resp['message']=='success') console.log('Successfully deleted selected object.')

      // Refresh:
      this.objecttsService.getAllForClient(this.loggedUser.username).subscribe((data : Objectt[])=>{
        this.allObjectts = data;
      })
    })
  }


  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }

}
