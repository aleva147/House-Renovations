import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  login(username, password) {
    const data = {
      username : username,
      password : password
    }

    return this.http.post('http://localhost:4000/users/login', data);
  }


  sendEmail(addressTo) {
    const data = {
      addressTo : addressTo,
      reason : "forgot password"
    }

    return this.http.post('http://localhost:4000/users/sendEmail', data);
  }


  findUser(username) {
    const data = {
      username : username
    }

    return this.http.post('http://localhost:4000/users/findUser', data);
  }

  findUserInclRegReqs(username) {
    const data = {
      username : username
    }

    return this.http.post('http://localhost:4000/users/findUserInclRegReqs', data);
  }

  findUserWithMail(mail) {
    const data = {
      mail : mail
    }

    return this.http.post('http://localhost:4000/users/findUserWithMail', data);
  }

  findUserWithMailInclRegReqs(mail) {
    const data = {
      mail : mail
    }

    return this.http.post('http://localhost:4000/users/findUserWithMailInclRegReqs', data);
  }

  sendRegRequest(username, password, phone, mail, type, photoname, 
    firstname, lastname, name, country, city, street, identification, description) {
    const data = {
      username : username, password : password, phone : phone, mail : mail, type : type,
      photoname : photoname, firstname : firstname, lastname : lastname, name : name,
      country : country, city : city, street : street,
      identification : identification, description : description
    }

    return this.http.post('http://localhost:4000/users/sendRegRequest', data);
  }

  getProfilePhoto(username) {
    const data = {
      username : username
    }

    return this.http.post('http://localhost:4000/users/getProfilePhoto', data);
  }

  getProfilePhotoWithPhotoname(photoname, type) {
    const data = {
      photoname : photoname,
      type : type
    }

    return this.http.post('http://localhost:4000/users/getProfilePhotoWithPhotoname', data);
  }

  changePassword(username, newPassword) {
    const data = {
      username : username,
      password : newPassword
    }

    return this.http.post('http://localhost:4000/users/changePassword', data);
  }

  addAgency(username, password, phone, mail, photoname, 
    name, country, city, street, identification, description) {
    const data = {
      username : username, password : password, phone : phone, mail : mail, 
      photoname : photoname, name : name,
      country : country, city : city, street : street,
      identification : identification, description : description
    }

    return this.http.post('http://localhost:4000/users/addAgency', data);
  }

  addClient(username, password, phone, mail, photoname, 
    firstname, lastname) {
    const data = {
      username : username, password : password, phone : phone, mail : mail, 
      photoname : photoname, firstname : firstname, lastname : lastname
    }

    return this.http.post('http://localhost:4000/users/addClient', data);
  }
}
