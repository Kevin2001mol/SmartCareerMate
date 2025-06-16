// src/app/app.routes.ts
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent }    from './pages/home/home.component';
import { LoginComponent }   from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: 'home',    component: HomeComponent },
  { path: 'login',   component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

export const AppRoutingModule = RouterModule.forRoot(routes);
