import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PUBLIC_NAV_LINKS } from '../../constants/constants';

@Component({
  selector: 'app-burger-menu',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './burger-menu.html',
  styleUrl: './burger-menu.css',
})
export class BurgerMenu {
  PUBLIC_NAV_LINKS = PUBLIC_NAV_LINKS;
  isOpen: boolean = false;

  toggleMenu() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
  }

  closeMenu() {
    this.isOpen = false;
    document.body.classList.remove('overflow-hidden');
  }
}
