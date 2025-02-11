import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoadDataComponent } from './pages/load-data/load-data.component';
import { JsonComponent } from './pages/json/json.component';
import { RazonSocialComponent } from './pages/razon-social/razon-social.component';
import { AlmacenesComponent } from './pages/almacenes/almacenes.component';
import { MovimientosComponent } from './pages/movimientos/movimientos.component';
import { RegistrarUsuariosComponent } from './pages/usuarios/registrar/registrar.component';
import { ListaUsuariosComponent } from './pages/usuarios/lista/lista.component';
import { RazonPlantaComponent } from './pages/razon-planta/razon-planta.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: LoadDataComponent },
      { path: 'json', component: JsonComponent },
      { path: 'permisos', component: RazonSocialComponent },
      { path: 'razon-planta', component: RazonPlantaComponent },
      { path: 'almacenes', component: AlmacenesComponent },
      { path: 'movimientos', component: MovimientosComponent },
      { path: 'usuario/registrar', component: RegistrarUsuariosComponent },
      { path: 'usuario/lista', component: ListaUsuariosComponent },
    ],
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
    useHash: true,
    onSameUrlNavigation: 'reload',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
