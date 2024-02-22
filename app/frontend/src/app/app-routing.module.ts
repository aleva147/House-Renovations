import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AgencyComponent } from './agency/agency.component';
import { ClientComponent } from './client/client.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { RegisterComponent } from './register/register.component';
import { GuestComponent } from './guest/guest.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ClientAgenciesComponent } from './client-agencies/client-agencies.component';
import { AgencyWorkersComponent } from './agency-workers/agency-workers.component';
import { AgencyAddWorkerComponent } from './agency-add-worker/agency-add-worker.component';
import { GuestAgencyDetailsComponent } from './guest-agency-details/guest-agency-details.component';
import { ClientAgencyDetailsComponent } from './client-agency-details/client-agency-details.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AddNewAgencyComponent } from './add-new-agency/add-new-agency.component';
import { AddNewClientComponent } from './add-new-client/add-new-client.component';
import { AdminRegistrationsComponent } from './admin-registrations/admin-registrations.component';
import { AdminAgencyWorkersComponent } from './admin-agency-workers/admin-agency-workers.component';
import { AdminAddWorkerComponent } from './admin-add-worker/admin-add-worker.component';
import { ClientObjectsComponent } from './client-objects/client-objects.component';
import { ClientObjectsAddComponent } from './client-objects-add/client-objects-add.component';
import { ClientObjectsAddSketchComponent } from './client-objects-add-sketch/client-objects-add-sketch.component';
import { ClientObjectsViewSketchComponent } from './client-objects-view-sketch/client-objects-view-sketch.component';
import { ClientObjectsEditObjectComponent } from './client-objects-edit-object/client-objects-edit-object.component';
import { ClientAgencyHireComponent } from './client-agency-hire/client-agency-hire.component';
import { AgencyJobsComponent } from './agency-jobs/agency-jobs.component';
import { AgencyClientDetailsComponent } from './agency-client-details/agency-client-details.component';
import { AgencyObjecttDetailsComponent } from './agency-objectt-details/agency-objectt-details.component';
import { ClientJobsComponent } from './client-jobs/client-jobs.component';
import { ClientJobsProgressComponent } from './client-jobs-progress/client-jobs-progress.component';
import { AgencyJobsWorkComponent } from './agency-jobs-work/agency-jobs-work.component';
import { AdminJobsComponent } from './admin-jobs/admin-jobs.component';
import { AdminClientDetailsComponent } from './admin-client-details/admin-client-details.component';
import { AdminObjecttDetailsComponent } from './admin-objectt-details/admin-objectt-details.component';
import { AdminJobsProgressComponent } from './admin-jobs-progress/admin-jobs-progress.component';

const routes: Routes = [
  { path: '', component: GuestComponent },  
  { path: 'guestAgencyDetails', component: GuestAgencyDetailsComponent },  
  { path: 'login', component: LoginComponent },   
  { path: 'register', component: RegisterComponent },
  { path: 'changePassword', component: ChangePasswordComponent },
  { path: 'agency', component: AgencyComponent },
  { path: 'agencyWorkers', component: AgencyWorkersComponent },
  { path: 'agencyAddWorker', component: AgencyAddWorkerComponent },
  { path: 'agencyJobs', component: AgencyJobsComponent },
  { path: 'agencyClientDetails', component: AgencyClientDetailsComponent },
  { path: 'agencyObjecttDetails', component: AgencyObjecttDetailsComponent },
  { path: 'agencyJobsWork', component: AgencyJobsWorkComponent },
  { path: 'client', component: ClientComponent },
  { path: 'clientAgencies', component: ClientAgenciesComponent },
  { path: 'clientAgencyDetails', component: ClientAgencyDetailsComponent }, 
  { path: 'clientAgencyHire', component: ClientAgencyHireComponent },
  { path: 'clientObjects', component: ClientObjectsComponent },
  { path: 'clientObjectsAdd', component: ClientObjectsAddComponent },
  { path: 'clientObjectsAddSketch', component: ClientObjectsAddSketchComponent },
  { path: 'clientObjectsViewSketch', component: ClientObjectsViewSketchComponent },
  { path: 'clientObjectsEditObject', component: ClientObjectsEditObjectComponent },
  { path: 'clientJobs', component: ClientJobsComponent },
  { path: 'clientJobsProgress', component: ClientJobsProgressComponent },
  { path: 'adminLogin', component: AdminLoginComponent },
  { path: 'adminUsers', component: AdminUsersComponent },
  { path: 'addNewClient', component: AddNewClientComponent },
  { path: 'addNewAgency', component: AddNewAgencyComponent },
  { path: 'adminAgencyWorkers', component: AdminAgencyWorkersComponent },
  { path: 'adminAddWorker', component: AdminAddWorkerComponent },
  { path: 'adminRegistrations', component: AdminRegistrationsComponent },
  { path: 'adminJobs', component: AdminJobsComponent },
  { path: 'adminClientDetails', component: AdminClientDetailsComponent },
  { path: 'adminObjecttDetails', component: AdminObjecttDetailsComponent },
  { path: 'adminJobsProgress', component: AdminJobsProgressComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
