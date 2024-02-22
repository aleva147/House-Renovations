import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ObjecttsService } from '../services/objectts.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Objectt } from '../models/objectt';
import { Room } from '../models/room';

import { HostListener } from "@angular/core"; // Za responzivno ocitavanje velicine prozora.


@Component({
  selector: 'app-client-objects-add-sketch',
  templateUrl: './client-objects-add-sketch.component.html',
  styleUrls: ['./client-objects-add-sketch.component.css']
})
export class ClientObjectsAddSketchComponent implements OnInit {

  constructor(private objecttsService: ObjecttsService, private router: Router) { }


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
      this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
      this.objecttId = JSON.parse(localStorage.getItem('newObjecttId'));

      this.objecttsService.getById(this.objecttId).subscribe((data : Objectt)=>{
        this.objectt = data;

        this.rooms = this.objectt.sketch;


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

          // Placing a new room:
          if (this.placing) {
            let newRoom : Room = new Room(this.startX/this.scale, this.startY/this.scale, this.newRoomWidth*this.inputScale, 
                                          this.newRoomHeight*this.inputScale, this.newRoomDoorWall, this.newRoomDoorPosition*this.inputScale)
            this.rooms.push(newRoom);
            this.placing = false;
            this.placingRoom = null;
            this.selectedRoom = newRoom;
          }
          // Selecting existing rooms:
          else {
            // Check if a room is selected:
            for(var i=0; i<this.rooms.length; i++){
                if(this.mouseOnRoom(this.startX,this.startY,this.rooms[i])){
                    this.selectedRoom = this.rooms[i];
                    this.dragging = true;
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
          }

          this.drawAll();
        }

        this.canvas.onmouseup = (e)=>{
          if (!this.dragging) return;

          e.preventDefault();
          e.stopPropagation();

          this.dragging = false;
        }

        this.canvas.onmousemove = (e)=>{
          if (!this.dragging && !this.placing) return;

          e.preventDefault();
          e.stopPropagation();

          // Calculate current mouse position in canvas and subtract it from the previous mouse position: (startX, startY)
          let offsetX = 0, offsetY = 0;

          if (this.canvas.offsetParent !== undefined) {
            do {
              offsetX += this.canvas.offsetLeft;
              offsetY += this.canvas.offsetTop;
            } while ((this.canvas == this.canvas.offsetParent));
          }

          let mouseX = e.pageX - offsetX;
          let mouseY = e.pageY - offsetY;

          if (this.dragging) {
            let dx = mouseX - this.startX;
            let dy = mouseY - this.startY;

            // Move the selected shape:
            this.selectedRoom.x += dx / this.scale;
            this.selectedRoom.y += dy / this.scale;
          }
          else if (this.placing) {
            this.placingRoom.x = mouseX / this.scale;
            this.placingRoom.y = mouseY / this.scale;
          }
          
          // Clear the canvas and redraw all shapes
          this.drawAll();

          // Update the starting drag position (== the current mouse position)
          this.startX = mouseX;
          this.startY = mouseY;
        }
      })
    }
  }


  // For a responsive canvas:
  screenWidth : number;
  screenHeight : number;
  originalCanvasWidth : number;
  originalCanvasHeight : number;
  scale : number;             

  // For loading and storing user's objectt data:
  loggedUser : User;
  objecttId : number;
  objectt : Objectt;

  // For drawing on the canvas:
  canvas : HTMLCanvasElement;
  context : CanvasRenderingContext2D;

  rooms : Room[] = [];
  dragging : boolean = false;
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

  // For adding a new room:
  newRoomWidth : number = 5;
  newRoomHeight : number = 5;
  newRoomDoorWall : string = "bottom";
  newRoomDoorPosition : number = 2;
  placing : boolean = false;
  placingRoom : Room;

  // Irregular placements:
  overlapping : boolean = false;
  isolated : boolean = false;
  message : string;

  
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

    if (this.placing) {
      color = "white";
      this.drawRoom(this.placingRoom, color, true);
    }

    this.checkForOverlap();
    if (this.overlapping == true) this.message = 'Rooms must not overlap!'; 
    else {
      this.checkForIsolated();
      if (this.isolated) {
        this.message = 'Rooms must be connected!';
      }
      else this.message = '';
    }
  }

  drawRoom(room, strokeColor, placingRoom) {
    this.context.strokeStyle = strokeColor;

    // Draw room:
    if (!placingRoom) {
      this.context.fillStyle = 'wheat';
      this.context.fillRect(room.x*this.scale,room.y*this.scale,room.width*this.scale,room.height*this.scale);
    }
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

  // Check if rooms are overlapping:
  checkForOverlap() {
    this.overlapping = false;

    this.rooms.forEach(r1 => {
      this.rooms.forEach(r2 => {
        if (r1 != r2) {
          if (r1.x < r2.x + r2.width &&
            r1.x + r1.width > r2.x &&
            r1.y < r2.y + r2.height &&
            r1.y + r1.height > r2.y) {
              this.overlapping = true;
              return;
         } 
        }
      })
    })
  }

  // Check if any room is isolated: (room must have at least one neighbour)
  checkForIsolated() {
    let padding = 1;
    this.isolated = false;

    if (this.rooms.length < 2) return;
    else {
      this.rooms.forEach(r1 => {
        let numOfNeigh = 0;

        this.rooms.forEach(r2 => {
          if (r1 != r2) {
            if (r1.x - padding < r2.x + r2.width &&
              r1.x + r1.width + padding > r2.x &&
              r1.y - padding < r2.y + r2.height &&
              r1.y + r1.height + padding > r2.y) {
                numOfNeigh++;
            }
          }
        })

        if (numOfNeigh == 0) {
          this.isolated = true;
          return;
        }
      })
    }
  }

  // Update canvas: (when changing room information)
  updateCanvas() {
    if (this.selectedRoom.width != this.newWidth*this.inputScale) {
      this.selectedRoom.width = this.newWidth*this.inputScale;

      if (this.selectedRoom.doorWall == "bottom" || this.selectedRoom.doorWall == "top") {
        this.selectedRoom.doorPosition = this.newWidth*this.inputScale/2 - this.doorWidth/2;
        this.newDoorPosition = this.selectedRoom.doorPosition/this.inputScale;
      } 
    }
    else if (this.selectedRoom.height != this.newHeight*this.inputScale) {
      this.selectedRoom.height = this.newHeight*this.inputScale;

      if (this.selectedRoom.doorWall == "left" || this.selectedRoom.doorWall == "right") {
        this.selectedRoom.doorPosition = this.newHeight*this.inputScale/2 - this.doorWidth/2;
        this.newDoorPosition = this.selectedRoom.doorPosition/this.inputScale;
      }
    }
    else if (this.selectedRoom.doorWall != this.newDoorWall) {
      this.selectedRoom.doorWall = this.newDoorWall;

      if (this.selectedRoom.doorWall == "bottom" || this.selectedRoom.doorWall == "top") {
        this.selectedRoom.doorPosition = this.newWidth*this.inputScale/2 - this.doorWidth/2;
      } 
      else {
        this.selectedRoom.doorPosition = this.newHeight*this.inputScale/2 - this.doorWidth/2;
      }
      this.newDoorPosition = this.selectedRoom.doorPosition/this.inputScale;
    }
    else if (this.selectedRoom.doorPosition != this.newDoorPosition*this.inputScale) {
      if (this.newDoorPosition < 0) this.newDoorPosition = 0;
      else if ((this.selectedRoom.doorWall == "bottom" || this.selectedRoom.doorWall == "top") 
        && this.newDoorPosition*this.inputScale > this.selectedRoom.width-this.doorWidth) this.newDoorPosition = (this.selectedRoom.width - this.doorWidth)/this.inputScale;
      else if ((this.selectedRoom.doorWall == "left" || this.selectedRoom.doorWall == "right") 
        && this.newDoorPosition*this.inputScale > this.selectedRoom.height-this.doorWidth) this.newDoorPosition = (this.selectedRoom.height - this.doorWidth)/this.inputScale;
      
      this.selectedRoom.doorPosition = this.newDoorPosition*this.inputScale;
    }

    this.drawAll();
  }
  

  eraseRoom() {
    let newRoomsArray : Room[] = [];
    this.rooms.forEach(r=>{
      if (r != this.selectedRoom) newRoomsArray.push(r);
    }) 
    this.rooms = newRoomsArray;
    this.selectedRoom = null;
    this.drawAll();
  }

  placeRoom() {
    this.placing = true;
    this.placingRoom = new Room(this.startX/this.scale, this.startY/this.scale, this.newRoomWidth*this.inputScale, 
                                this.newRoomHeight*this.inputScale, this.newRoomDoorWall, this.newRoomDoorPosition*this.inputScale)
  }


  // Erase everything on canvas:
  eraseSketch() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.rooms = [];
  }

  saveSketch() {
    this.objecttsService.saveSketch(this.objecttId, this.rooms).subscribe(resp=>{
      if (resp['message']=='success') console.log('Successfully saved sketch');
      this.router.navigate(['clientObjects']);
    })
  }



  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
