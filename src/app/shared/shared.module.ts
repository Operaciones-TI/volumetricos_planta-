/*
  This is a module that is imported into other modules.
  It exports the DarkmodeComponent component.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkmodeComponent } from '../components/darkmode/darkmode.component';


@NgModule({
  declarations: [DarkmodeComponent],
  imports: [
    CommonModule,
  ],
  exports: [DarkmodeComponent]
})
export class SharedModule { }
