import { Routes } from '@angular/router';
import { LoadDataComponent } from 'src/app/pages/load-data/load-data.component';
import { JsonComponent } from 'src/app/pages/json/json.component';
import { MainLayoutComponent } from './main-layout.component';
import { RazonSocialComponent } from 'src/app/pages/razon-social/razon-social.component';
import { RazonPlantaComponent } from 'src/app/pages/razon-planta/razon-planta.component';
import { AlmacenesComponent } from 'src/app/pages/almacenes/almacenes.component';
import { MovimientosComponent } from 'src/app/pages/movimientos/movimientos.component';
import { RegistrarUsuariosComponent } from 'src/app/pages/usuarios/registrar/registrar.component';
import { ListaUsuariosComponent } from 'src/app/pages/usuarios/lista/lista.component';

export const MainLayoutRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: LoadDataComponent },
      { path: 'json', component: JsonComponent},
      { path: 'permisos', component: RazonSocialComponent},
      { path: 'razon-planta', component: RazonPlantaComponent},
      { path: 'almacenes', component: AlmacenesComponent},
      { path: 'movimientos', component: MovimientosComponent},
      { path: 'usuario/registrar', component: RegistrarUsuariosComponent },
      { path: 'usuario/lista', component: ListaUsuariosComponent }
    ]
  }
];
