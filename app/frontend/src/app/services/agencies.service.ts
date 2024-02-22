import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgenciesService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get('http://localhost:4000/agencies/getAll');
  }

  getAgency(username) {
    const data = {
      username : username
    }
    
    return this.http.post('http://localhost:4000/agencies/getAgency', data);
  }

  updateAgency(username, name, country, city, street, description, photoname, phone, mail) {
    const data = {
      username : username,
      name : name,
      country : country,
      city : city,
      street : street,
      description : description,
      phone : phone,
      mail : mail,
      photoname : photoname,
    }
    
    return this.http.post('http://localhost:4000/agencies/updateAgency', data);
  }

  changeOpenPositions(username, amount) {
    const data = {
      username : username,
      amount : amount
    }
    
    return this.http.post('http://localhost:4000/agencies/changeOpenPositions', data);
  }

  getAllWorkers(agencyUsername) {
    const data = {
      agency : agencyUsername
    }
    
    return this.http.post('http://localhost:4000/agencies/getAllWorkers', data);
  }

  removeWorker(agency, id) {
    const data = {
      agency : agency,
      id : id
    }
    
    return this.http.post('http://localhost:4000/agencies/removeWorker', data);
  }

  updateWorker(agency, id, firstname, lastname, phone, mail, field) {
    const data = {
      agency : agency,
      id : id,
      firstname : firstname,
      lastname : lastname,
      phone : phone,
      mail : mail,
      field : field
    }
    
    return this.http.post('http://localhost:4000/agencies/updateWorker', data);
  }

  addWorker(agency, firstname, lastname, phone, mail, field) {
    const data = {
      agency : agency,
      firstname : firstname,
      lastname : lastname,
      phone : phone,
      mail : mail,
      field : field
    }
    
    return this.http.post('http://localhost:4000/agencies/addWorker', data);
  }

  getComments(agency) {
    const data = {
      agency : agency
    }
    
    return this.http.post('http://localhost:4000/agencies/getComments', data);
  }

  remove(username) {
    const data = {
      username : username
    }
    
    return this.http.post('http://localhost:4000/agencies/remove', data);
  }

  getNewRequests(username) {
    const data = {
      agency : username
    }
    
    return this.http.post('http://localhost:4000/agencies/getNewRequests', data);
  }

  acceptRequest(jobId, cost) {
    const data = {
      id : jobId,
      cost : cost
    }
    
    return this.http.post('http://localhost:4000/agencies/acceptRequest', data);
  }

  refuseRequest(jobId) {
    const data = {
      id : jobId
    }
    
    return this.http.post('http://localhost:4000/agencies/refuseRequest', data);
  }

  getActiveJobs(username) {
    const data = {
      agency : username
    }
    
    return this.http.post('http://localhost:4000/agencies/getActiveJobs', data);
  }

  getAvailableWorkers(agencyUsername) {
    const data = {
      agency : agencyUsername
    }
    
    return this.http.post('http://localhost:4000/agencies/getAvailableWorkers', data);
  }
  
  getAssignedWorkers(agencyUsername, jobId) {
    const data = {
      agency : agencyUsername,
      job : jobId
    }
    
    return this.http.post('http://localhost:4000/agencies/getAssignedWorkers', data);
  }

  getWorker(id) {
    const data = {
      id : id
    }
    
    return this.http.post('http://localhost:4000/agencies/getWorker', data);
  }

  assignWorker(workerId, jobId, rooms) {
    const data = {
      workerId : workerId,
      jobId : jobId,
      sketch : rooms
    }
    
    return this.http.post('http://localhost:4000/agencies/assignWorker', data);
  }

  updateJobSketch(jobId, rooms) {
    const data = {
      jobId : jobId,
      sketch : rooms
    }
    
    return this.http.post('http://localhost:4000/agencies/updateJobSketch', data);
  }

  freeWorker(workerId) {
    const data = {
      workerId : workerId
    }
    
    return this.http.post('http://localhost:4000/agencies/freeWorker', data);
  }
}
