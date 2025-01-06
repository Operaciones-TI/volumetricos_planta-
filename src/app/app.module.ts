import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
// import { NgIdleModule } from '@ng-idle/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
// import { DarkmodeComponent } from './components/darkmode/darkmode.component';
import { SharedModule } from './shared/shared.module';
import { LoadDataComponent } from './pages/load-data/load-data.component';
import { JsonComponent } from './pages/json/json.component';
import { ListaUsuariosComponent } from './pages/usuarios/lista/lista.component';
import { EditarUsuariosComponent } from './pages/usuarios/editar/editar.component';
import { RegistrarUsuariosComponent } from './pages/usuarios/registrar/registrar.component';
import { NuevoPasswordUsuarioComponent } from './pages/usuarios/new-password/editar.component';

import { ToastrModule } from 'ngx-toastr';

import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoadDataComponent,
    JsonComponent,
    ListaUsuariosComponent,
    EditarUsuariosComponent,
    RegistrarUsuariosComponent,
    NuevoPasswordUsuarioComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    SharedModule,
    AngularMaterialModule
  ],
  providers: [
    AuthService,
    UsuarioService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
