import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private http: HttpClient) { }

  getClient(username) {
    const data = {
      username : username
    }

    return this.http.post('http://localhost:4000/clients/getClient', data);
  }

  getAll() {
    return this.http.get('http://localhost:4000/clients/getAll');
  }

  updateClient(username, firstname, lastname, phone, mail, photoname) {
    const data = {
      username : username,
      firstname : firstname,
      lastname : lastname,
      phone : phone,
      mail : mail,
      photoname : photoname,
    }

    return this.http.post('http://localhost:4000/clients/updateClient', data);
  }

  remove(username) {
    const data = {
      username : username
    }

    return this.http.post('http://localhost:4000/clients/remove', data);
  }

  sendJobRequest(clientUsername, objectId, agencyUsername, starting, deadline, sketch) {
    const data = {
      client : clientUsername,
      object : objectId,
      agency : agencyUsername,
      starting : starting,
      deadline : deadline,
      sketch : sketch
    }

    return this.http.post('http://localhost:4000/clients/sendJobRequest', data);
  }

  getRequests(clientUsername) {
    const data = {
      client : clientUsername
    }

    return this.http.post('http://localhost:4000/clients/getRequests', data);
  }

  getActiveJobs(clientUsername) {
    const data = {
      client : clientUsername
    }

    return this.http.post('http://localhost:4000/clients/getActiveJobs', data);
  }

  getFinishedJobs(clientUsername) {
    const data = {
      client : clientUsername
    }

    return this.http.post('http://localhost:4000/clients/getFinishedJobs', data);
  }

  acceptRequest(requestId) {
    const data = {
      id : requestId
    }

    return this.http.post('http://localhost:4000/clients/acceptRequest', data);
  }

  refuseRequest(requestId) {
    const data = {
      id : requestId
    }

    return this.http.post('http://localhost:4000/clients/refuseRequest', data);
  }

  finishJob(jobId) {
    const data = {
      id : jobId
    }

    return this.http.post('http://localhost:4000/clients/finishJob', data);
  }

  terminationReq(jobId, reason) {
    const data = {
      id : jobId,
      reason : reason
    }

    return this.http.post('http://localhost:4000/clients/terminationReq', data);
  }

  createComment(client, agency, text, grade, jobId) {
    const data = {
      username : client,
      agency : agency,
      text : text,
      grade : grade,
      jobId : jobId
    }

    return this.http.post('http://localhost:4000/clients/createComment', data);
  }

  getComment(commentId) {
    const data = {
      id : commentId
    }

    return this.http.post('http://localhost:4000/clients/getComment', data);
  }

  updateComment(id, text, grade) {
    const data = {
      id : id,
      text : text,
      grade : grade
    }

    return this.http.post('http://localhost:4000/clients/updateComment', data);
  }

  deleteComment(commentId, jobId) {
    const data = {
      id : commentId,
      jobId : jobId
    }

    return this.http.post('http://localhost:4000/clients/deleteComment', data);
  }

}
