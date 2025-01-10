import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrarUsuariosComponent } from './pages/usuarios/registrar/registrar.component';
import { ListaUsuariosComponent } from './pages/usuarios/lista/lista.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', loadChildren: () => import('./layouts/main-layout/main-layout.module').then(m => m.MainLayoutModule) },
  { path: 'json', loadChildren: () => import('./layouts/main-layout/main-layout.module').then(m => m.MainLayoutModule) },
  { path: 'permisos', loadChildren: () => import('./layouts/main-layout/main-layout.module').then(m => m.MainLayoutModule) },
  { path: 'razon-planta', loadChildren: () => import('./layouts/main-layout/main-layout.module').then(m => m.MainLayoutModule) },
  { path: 'usuario/registrar', component: RegistrarUsuariosComponent },
  { path: 'usuario/lista', component: ListaUsuariosComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
