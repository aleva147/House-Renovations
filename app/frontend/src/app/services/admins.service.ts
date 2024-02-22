import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminsService {

  constructor(private http: HttpClient) { }


  addReqWorkers(agency, amount) {
    const data = {
      agency : agency,
      amount : amount
    }
    
    return this.http.post('http://localhost:4000/admins/addReqWorkers', data);
  }

  removeReqWorkers(id) {
    const data = {
      id : id
    }
    
    return this.http.post('http://localhost:4000/admins/removeReqWorkers', data);
  }

  getAllReqWorkers(agency) {
    const data = {
      agency : agency
    }
    
    return this.http.post('http://localhost:4000/admins/getAllReqWorkers', data);
  }

  getAllRegRequests() {
    return this.http.get('http://localhost:4000/admins/getAllRegRequests');
  }

  changeRegRequestStatus(id, status) {
    const data = {
      id : id,
      status : status
    }
    
    return this.http.post('http://localhost:4000/admins/changeRegRequestStatus', data);
  }

  getAllActiveJobs() {
    return this.http.get('http://localhost:4000/admins/getAllActiveJobs');
  }

  getAllFinishedJobs() {
    return this.http.get('http://localhost:4000/admins/getAllFinishedJobs');
  }

  declineTermination(jobId) {
    const data = {
      id : jobId
    }
    
    return this.http.post('http://localhost:4000/admins/declineTermination', data);
  }

  acceptTermination(jobId) {
    const data = {
      id : jobId
    }
    
    return this.http.post('http://localhost:4000/admins/acceptTermination', data);
  }
}
