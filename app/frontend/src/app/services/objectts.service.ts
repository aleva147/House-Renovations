import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room } from '../models/room';

@Injectable({
  providedIn: 'root'
})
export class ObjecttsService {

  constructor(private http: HttpClient) { }

  getAllForClient(username) {
    const data = {
      client : username
    }

    return this.http.post('http://localhost:4000/objectts/getAllForClient', data);
  }

  getById(id) {
    const data = {
      id : id
    }

    return this.http.post('http://localhost:4000/objectts/getById', data);
  }

  remove(id) {
    const data = {
      id : id
    }

    return this.http.post('http://localhost:4000/objectts/remove', data);
  }

  addObjectt(client, type, address, numOfRooms, sqFootage, rooms : Room[]) {
    const data = {
      client : client,
      type : type,
      address : address,
      numOfRooms : numOfRooms,
      sqFootage : sqFootage,
      rooms : rooms
    }

    return this.http.post('http://localhost:4000/objectts/addObjectt', data);
  }

  saveSketch(objecttId, rooms : Room[]) {
    const data = {
      id : objecttId,
      rooms : rooms
    }

    return this.http.post('http://localhost:4000/objectts/saveSketch', data);
  }

  updateObjecttInfo(id, type, address, numOfRooms, sqFootage) {
    const data = {
      id : id,
      type : type,
      address : address,
      numOfRooms : numOfRooms,
      sqFootage : sqFootage
    }

    return this.http.post('http://localhost:4000/objectts/updateObjecttInfo', data);
  }

  uploadObjectt(jsonObject) {
    const data = {
      jsonObject : jsonObject
    }

    return this.http.post('http://localhost:4000/objectts/uploadObjectt', data);
  }
}
