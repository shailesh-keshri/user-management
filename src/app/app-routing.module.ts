import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from './auth.guard';
import { WorkerComponent } from './components/worker/worker.component';
import { SuperVisorComponent } from './components/super-visor/super-visor.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch:'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: SignupComponent},
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'supervisor',
    component: SuperVisorComponent,
    canActivate: [AuthGuard],
    data: { roles: ['supervisor', 'admin'] }
  },
  {
    path: 'worker',
    component: WorkerComponent,
    canActivate: [AuthGuard],
    data: { roles: ['worker', 'supervisor', 'admin'] }
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
