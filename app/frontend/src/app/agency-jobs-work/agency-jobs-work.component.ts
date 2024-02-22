import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ObjecttsService } from '../services/objectts.service';
import { Router } from '@angular/router';
import { Objectt } from '../models/objectt';
import { Room } from '../models/room';
import { Job } from '../models/job';
import { AgenciesService } from '../services/agencies.service';
import { Worker } from '../models/worker';

@Component({
  selector: 'app-agency-jobs-work',
  templateUrl: './agency-jobs-work.component.html',
  styleUrls: ['./agency-jobs-work.component.css']
})
export class AgencyJobsWorkComponent implements OnInit {

  constructor(private objecttsService: ObjecttsService, private agenciesService: AgenciesService, private router: Router) {}

  @ViewChild('canvas', { static : true }) myCanvas : ElementRef;
  ngOnInit(): void {
    this.getScreenSize();

    this.canvas = this.myCanvas.nativeElement;
    this.originalCanvasWidth = this.canvas.width;
    this.originalCanvasHeight = this.canvas.height
    this.canvas.width = this.originalCanvasWidth * this.scale;
    this.canvas.height = this.originalCanvasHeight * this.scale;


    this.context = this.canvas.getContext('2d');
    if (this.context) { 

      // For objectt information:
      this.selectedJob = JSON.parse(localStorage.getItem('selectedJob'));
    
      this.agenciesService.getAvailableWorkers(this.selectedJob.agency).subscribe((data : Worker[])=>{
        this.availableWorkers = data;

        this.agenciesService.getAssignedWorkers(this.selectedJob.agency, this.selectedJob.id).subscribe((data : Worker[])=>{
          this.assignedWorkers = data;


          this.rooms = this.selectedJob.sketch;


          if (this.availableWorkers.length + this.assignedWorkers.length < this.rooms.length) {
            this.notEnoughWorkers = true;
            this.messageOverall = 'You do not have enough available workers to start work on this object!';
          }
          this.rooms.forEach(r=>{
            if (r.status == 'none' && (!r.workers || r.workers.length < 1)) this.messageOverall = "Every room must have at least one worker assigned!";
            if (r.workers) {
              r.workersNames = [];
              r.workers.forEach(w=>{
                this.agenciesService.getWorker(w).subscribe((data:Worker)=>{
                  r.workersNames.push(data.firstname + ' ' + data.lastname);
                })
              })
            }
          })


          // Draw default sketch on canvas:
          this.drawAll();

          ///////////////////
          // MOUSE EVENTS: //
          ///////////////////
          this.canvas.onmousedown = (e)=>{
            // Tell the browser we're handling this event:
            e.preventDefault();
            e.stopPropagation();

            // Calculate where inside the canvas the mouse was pressed: (startX, startY)
            let offsetX = 0, offsetY = 0;

            if (this.canvas.offsetParent !== undefined) {
              do {
                offsetX += this.canvas.offsetLeft;
                offsetY += this.canvas.offsetTop;
              } while ((this.canvas == this.canvas.offsetParent));
            }

            this.startX = e.pageX - offsetX;
            this.startY = e.pageY - offsetY;

            // Check if a room is selected:
            for(var i=0; i<this.rooms.length; i++){
                if(this.mouseOnRoom(this.startX,this.startY,this.rooms[i])){
                    this.selectedRoom = this.rooms[i];
                    
                    this.progress = this.selectedRoom.progress
                    this.messagePanel = '';

                    this.drawAll();

                    this.newWidth = this.selectedRoom.width / this.inputScale;
                    this.newHeight = this.selectedRoom.height / this.inputScale;
                    this.newDoorWall = this.selectedRoom.doorWall;
                    this.newDoorPosition = this.selectedRoom.doorPosition / this.inputScale;
                    
                    return;
                }
            }
            // No room selected:
            this.selectedRoom = null;

            this.drawAll();
          }
        })
      })     
    }
  }

  
  selectedJob : Job;

  // For a responsive canvas:
  screenWidth : number;
  screenHeight : number;
  originalCanvasWidth : number;
  originalCanvasHeight : number;
  scale : number;             

  // For drawing on the canvas:
  canvas : HTMLCanvasElement;
  context : CanvasRenderingContext2D;

  rooms : Room[] = [];
  selectedRoom : Room = null;    
  startX : number;
  startY : number;

  doorWidth : number = 10;
  doorHeight : number = 15;

  // For changing room info:
  newWidth : number;
  newHeight : number;
  newDoorWall : string;
  newDoorPosition : number;
  inputScale : number = 10;

  // Additional:
  availableWorkers : Worker[] = [];
  assignedWorkers : Worker[] = [];
  notEnoughWorkers : boolean = false;
  messageOverall : string = '';

  workerToAdd : number;
  workerToRemove : number;
  progress : number;
  messagePanel : string = '';
  numberRegex = /^\d+$/;


  addWorker() {
    this.messagePanel = '';
    if (!this.workerToAdd) {
      this.messagePanel = "You must pick a worker first.";
      return;
    }

    if (!this.selectedRoom.workersNames) this.selectedRoom.workersNames = new Array<string>;
    this.selectedRoom.workers.push(this.workerToAdd);

    // Update page: (MUST BE BEFORE UPDATE DB!)
    this.agenciesService.getWorker(this.workerToAdd).subscribe((data:Worker)=>{
      this.selectedRoom.workersNames.push(data.firstname + ' ' + data.lastname)

      this.assignedWorkers.push(data);
      this.availableWorkers = this.availableWorkers.filter(w=> w.id != this.workerToAdd);
      
      console.log(this.selectedJob);
      
      localStorage.setItem('selectedJob', JSON.stringify(this.selectedJob))
    })
    
    // Update db: (worker object, rooms workers)
    this.agenciesService.assignWorker(this.workerToAdd, this.selectedJob.id, this.rooms).subscribe(resp=>{
      console.log("Worker assigned.");

      let allRoomsOk : boolean = true;
      this.rooms.forEach(r=>{
        if (r.status == 'none' && (!r.workers || r.workers.length < 1)) allRoomsOk = false;
      })
      if (allRoomsOk == true) {
        this.messageOverall = "";

      }
      else {
        this.messageOverall = "Every room must have at least one worker assigned!";
      }
    })
  }

  updateProgress() {
    if (!this.numberRegex.test(this.progress.toString())) {
      this.messagePanel = 'Progress must be a positive number number.';
    }
    else if (this.progress > 100) {
      this.messagePanel = 'Progress cannot be higher than 100.';
    }
    else if (this.progress < 0) {
      this.messagePanel = 'Progress cannot be negative.';
    }
    else if (Number(this.progress) < Number(this.selectedRoom.progress)) {
      console.log(this.progress, this.selectedRoom.progress);
      
      this.messagePanel = 'You cannot decrease existing progress.';
    }
    else {
      this.messagePanel = '';

      if (this.progress == 100) {
        // Update page and database:
        this.finishRoom();
      }
      else if (this.progress > 0) {
        // Update page:
        this.selectedRoom.progress = this.progress;
        this.selectedRoom.status = 'working';
        this.drawAll();
        localStorage.setItem('selectedJob', JSON.stringify(this.selectedJob));

        // Update database:
        this.agenciesService.updateJobSketch(this.selectedJob.id, this.rooms).subscribe(resp=>{
          if (resp['message']=='success') console.log('Successfully updated progress.');
        })
      }
    }
  }

  async finishRoom() {
    // Update database: Free Workers from Room:
    await this.freeWorkers();

    // Update page:
    this.selectedRoom.progress = 100;
    this.selectedRoom.status = 'finished';

    this.selectedRoom.workers = [];
    this.selectedRoom.workersNames = [];

    this.agenciesService.getAvailableWorkers(this.selectedJob.agency).subscribe((data : Worker[])=>{
      this.availableWorkers = data;
    })

    this.agenciesService.getAssignedWorkers(this.selectedJob.agency, this.selectedJob.id).subscribe((data : Worker[])=>{
      this.assignedWorkers = data;
    })

    this.drawAll();
    localStorage.setItem('selectedJob', JSON.stringify(this.selectedJob));

    // Update database: Set status to finished and update progress.
    this.agenciesService.updateJobSketch(this.selectedJob.id, this.rooms).subscribe(resp=>{
      if (resp['message']=='success') console.log('Successfully finished room.');
    })
  }

  async freeWorkers() {
    this.selectedRoom.workers.forEach(w=>{
      this.agenciesService.freeWorker(w).subscribe(resp=>{
        if (resp['message']=='success') console.log('Worker removed from room.');
      })
    })
  }

  // For responsive canvas size:
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;

        let newScale : number;
        if (this.screenWidth > 1200) newScale = 2.5;
        else if (this.screenWidth > 800) newScale = 1.75;
        else if (this.screenWidth > 600) newScale = 1.35;
        else if (this.screenWidth > 400) newScale = 1;
        else newScale = 0.8;

        if (!this.scale) {
          this.scale = newScale;
        }
        else if (this.scale != newScale) {
          this.scale = newScale;
          this.resizeCanvas();
        }
  }
  resizeCanvas(){
    this.canvas.width = this.originalCanvasWidth * this.scale;
    this.canvas.height = this.originalCanvasHeight * this.scale;
    this.drawAll();
  }

  

  // Determine if the mouse coordinates are inside the room's bounds
  mouseOnRoom(mx, my, room) {
    return  (room.x * this.scale <= mx) && (room.x * this.scale + room.width * this.scale >= mx) &&
            (room.y * this.scale <= my) && (room.y * this.scale + room.height * this.scale >= my);
  }

  // Redraw everything on canvas:
  drawAll(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    let color : string;
    for(let i = 0; i < this.rooms.length; i++){
        let room = this.rooms[i];
        
        if (room == this.selectedRoom) color = "red";
        else color = "black";

        this.drawRoom(room, color, false);
    }
  }

  drawRoom(room, strokeColor, placingRoom) {
    this.context.strokeStyle = strokeColor;

    // Draw room:
    if (this.notEnoughWorkers == true) this.context.fillStyle = 'yellow';
    else if (room.status == 'none') this.context.fillStyle = 'wheat';
    else if (room.status == 'working') this.context.fillStyle = 'indianred';
    else if (room.status == 'finished') this.context.fillStyle = 'chartreuse';
    this.context.fillRect(room.x*this.scale,room.y*this.scale,room.width*this.scale,room.height*this.scale);
    this.context.strokeRect(room.x*this.scale,room.y*this.scale,room.width*this.scale,room.height*this.scale);

    // Draw door:
    this.context.fillStyle = 'sienna';
    if (room.doorWall == "bottom") {
      this.context.fillRect(room.x*this.scale+room.doorPosition*this.scale, room.y*this.scale+room.height*this.scale-this.doorHeight*this.scale, this.doorWidth*this.scale, this.doorHeight*this.scale);
      this.context.strokeRect(room.x*this.scale+room.doorPosition*this.scale, room.y*this.scale+room.height*this.scale-this.doorHeight*this.scale, this.doorWidth*this.scale, this.doorHeight*this.scale);
    }
    else if (room.doorWall == "top") {
      this.context.fillRect(room.x*this.scale+room.doorPosition*this.scale, room.y*this.scale, this.doorWidth*this.scale, this.doorHeight*this.scale);
      this.context.strokeRect(room.x*this.scale+room.doorPosition*this.scale, room.y*this.scale, this.doorWidth*this.scale, this.doorHeight*this.scale);
    }
    else if (room.doorWall == "left") {
      this.context.fillRect(room.x*this.scale, room.y*this.scale+room.doorPosition*this.scale, this.doorHeight*this.scale, this.doorWidth*this.scale);
      this.context.strokeRect(room.x*this.scale, room.y*this.scale+room.doorPosition*this.scale, this.doorHeight*this.scale, this.doorWidth*this.scale);
    }
    else if (room.doorWall == "right") {
      this.context.fillRect(room.x*this.scale+room.width*this.scale-this.doorHeight*this.scale, room.y*this.scale+room.doorPosition*this.scale, this.doorHeight*this.scale, this.doorWidth*this.scale);
      this.context.strokeRect(room.x*this.scale+room.width*this.scale-this.doorHeight*this.scale, room.y*this.scale+room.doorPosition*this.scale, this.doorHeight*this.scale, this.doorWidth*this.scale);
    }
  }



  return() {
    this.router.navigate(['agencyJobs']);
  }

  close() {
    this.router.navigate(['agencyJobs'])
  }

  logout() {
    localStorage.clear();
  }
}
