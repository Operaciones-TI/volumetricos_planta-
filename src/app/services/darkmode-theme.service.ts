import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkmodeThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  public isDarkMode = this.darkMode.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.darkMode.next(savedTheme === 'dark');
      this.updateTheme(savedTheme === 'dark');
    }
  }

  toggleDarkMode(): void {
    const isDark = !this.darkMode.value;
    this.darkMode.next(isDark);
    this.updateTheme(isDark);
  }

  private updateTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
