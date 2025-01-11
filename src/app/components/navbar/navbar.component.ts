import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { Identity } from 'src/app/interfaces/Identity.interface';

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
    trigger('dropdownAnimation', [
      state('open', style({ opacity: 1, transform: 'translateY(0)', pointerEvents: 'auto' })),
      state('closed', style({ opacity: 0, transform: 'translateY(-10%)', pointerEvents: 'none' })),
      transition('open => closed', animate('0.3s ease-in-out')),
      transition('closed => open', animate('0.3s ease-in-out'))
    ]),
  ]
})

export class NavbarComponent implements OnInit {
  isMenuOpen: boolean = false;
  animationState: string = 'enter';
  dorpdwonAnimation: string = 'closed';
  isDropdownOpen = false;
  userOptions: boolean = false;
  userName: string = '';

  constructor(
    private router: Router,
    private usrServ: AuthService,
  ) { }

  ngOnInit(): void {
  }

  getUserProfilePic() {
    const user: Identity = this.usrServ.ObtenerIdentity();
    this.userName = user.nombre ? user.nombre : 'Usuario';
    return user
    ? `https://ui-avatars.com/api/?name=${user?.nombre}+${user?.apellidos}`
    : 'https://ui-avatars.com/api/?name=Usuario';
  }

  showUserOptions() {
    this.userOptions = !this.userOptions;
    this.dorpdwonAnimation = this.dorpdwonAnimation === 'open' ? 'closed' : 'open';
  }

  userLogout() {
    this.usrServ.Logout();
    this.router.navigate(['login']);
  }
  handleLogout() {
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.animationState = this.animationState === 'enter' ? 'exit' : 'enter';
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
