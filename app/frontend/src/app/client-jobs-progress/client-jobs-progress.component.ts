import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user';
import { Objectt } from '../models/objectt';
import { Room } from '../models/room';
import { ObjecttsService } from '../services/objectts.service';
import { Router } from '@angular/router';
import { Job } from '../models/job';
import { ClientsService } from '../services/clients.service';

@Component({
  selector: 'app-client-jobs-progress',
  templateUrl: './client-jobs-progress.component.html',
  styleUrls: ['./client-jobs-progress.component.css']
})
export class ClientJobsProgressComponent implements OnInit {

  constructor(private objecttsService: ObjecttsService, private router: Router, private clientsService: ClientsService) { }


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
      this.selectedJob = JSON.parse(localStorage.getItem('selectedJob')); 

      this.rooms = this.selectedJob.sketch;
      
      let finishedRooms = this.rooms.filter(r=>r.status=='finished');
      this.allRoomsFinished = finishedRooms.length == this.rooms.length;

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
    }
  }



  // For a responsive canvas:
  screenWidth : number;
  screenHeight : number;
  originalCanvasWidth : number;
  originalCanvasHeight : number;
  scale : number;             

  // For loading and storing user's objectt data:
  selectedJob : Job;

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
  allRoomsFinished : boolean = false;
  reason : string = '';
  message : string = '';
  error : boolean = false;


  
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

        this.drawRoom(room, color);
    }
  }

  drawRoom(room : Room, strokeColor) {
    this.context.strokeStyle = strokeColor;

    // Draw room:
    if (room.status == 'none') this.context.fillStyle = 'wheat';
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
    this.router.navigate(['clientJobs']);
  }

  pay() {
    this.clientsService.finishJob(this.selectedJob.id).subscribe(resp=>{
      if (resp['message']=='success') console.log('Job finished.');

      this.router.navigate(['clientJobs']);
    })
  }

  terminate() {
    this.error = false;
    this.message = '';
    this.reason = '';
  }

  // Update reason and update job status to 'termination'.
  sendTermination() {
    if (this.reason == '') {
      this.error = true;
      this.message = 'You must enter a reason.';
      return;
    }
    this.error = false;
    this.message = '';

    this.clientsService.terminationReq(this.selectedJob.id, this.reason).subscribe(resp=>{
      if (resp['message']=='success') console.log('Termination request sent.');

      this.message = 'Termination request sent. It will be reviewed shortly.';
    })
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }

}
