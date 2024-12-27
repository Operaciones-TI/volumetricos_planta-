import { Component, OnInit } from '@angular/core';
import { DarkmodeThemeService } from 'src/app/services/darkmode-theme.service';

@Component({
  selector: 'app-darkmode',
  templateUrl: './darkmode.component.html',
  styleUrls: ['./darkmode.component.scss']
})
export class DarkmodeComponent implements OnInit {
  darkMode = false;

  constructor( private darkmodeThemeService: DarkmodeThemeService ) {
    this.darkmodeThemeService.isDarkMode.subscribe(isDarkMode => {
      this.darkMode = isDarkMode;
    });
  }

  toggleTheme(): void {
    this.darkmodeThemeService.toggleDarkMode();
  }

  ngOnInit(): void {
  }

}
