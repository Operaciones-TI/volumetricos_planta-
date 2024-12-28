import { Routes } from '@angular/router';
import { LoadDataComponent } from 'src/app/pages/load-data/load-data.component';
import { MainLayoutComponent } from './main-layout.component';

export const MainLayoutRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: LoadDataComponent },
      
    ]
  }
];