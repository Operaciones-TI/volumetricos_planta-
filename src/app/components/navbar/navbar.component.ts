import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('enterAnimation', [
      state('enter', style({ opacity: 1, transform: 'translateX(0)' })),
      state('exit', style({ opacity: 0, transform: 'translateX(-100%)' })),
      transition('enter => exit', animate('0.8s ease-in-out')),
      transition('exit => enter', animate('0.8s ease-in-out'))
    ]),
  ]
})

export class NavbarComponent implements OnInit {
  isMenuOpen: boolean = false;
  animationState: string = 'enter';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  handleLogout() {
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.animationState = this.animationState === 'enter' ? 'exit' : 'enter';
  }
}
