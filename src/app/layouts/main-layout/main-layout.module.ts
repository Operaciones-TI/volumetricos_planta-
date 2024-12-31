import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { MainLayoutRoutes } from './main-layout.routing.module';
import { SharedModule } from 'src/app/shared/shared.module'

@NgModule({
  declarations: [
    MainLayoutComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(MainLayoutRoutes),
    SharedModule
  ]
})
export class MainLayoutModule { }
