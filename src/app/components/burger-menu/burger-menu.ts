import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PRIVATE_NAV_LINKS, PUBLIC_NAV_LINKS } from '../../constants/constants';
import { Account } from '../../services/account';
import { Button } from '../button/button';

@Component({
  selector: 'app-burger-menu',
  imports: [CommonModule, RouterLink, Button],
  standalone: true,
  templateUrl: './burger-menu.html',
  styleUrl: './burger-menu.css',
})
export class BurgerMenu {
  PUBLIC_NAV_LINKS = PUBLIC_NAV_LINKS;
  PRIVATE_NAV_LINKS = PRIVATE_NAV_LINKS;
  isOpen: boolean = false;
  accountService = inject(Account);

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
