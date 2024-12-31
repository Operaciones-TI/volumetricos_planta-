import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { DarkmodeComponent } from './components/darkmode/darkmode.component';
import { LoadDataComponent } from './pages/load-data/load-data.component';
import { JsonComponent } from './pages/json/json.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DarkmodeComponent,
    LoadDataComponent,
    JsonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
