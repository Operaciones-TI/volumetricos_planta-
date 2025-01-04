import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { JsonComponent } from 'src/app/pages/json/json.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', loadChildren: () => import('./layouts/main-layout/main-layout.module').then(m => m.MainLayoutModule) },
  { path: 'json', loadChildren: () => import('./layouts/main-layout/main-layout.module').then(m => m.MainLayoutModule) },
  { path: 'razon-social', loadChildren: () => import('./layouts/main-layout/main-layout.module').then(m => m.MainLayoutModule) },
  { path: 'razon-planta', loadChildren: () => import('./layouts/main-layout/main-layout.module').then(m => m.MainLayoutModule) },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
