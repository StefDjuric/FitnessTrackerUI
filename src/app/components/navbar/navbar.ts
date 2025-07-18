import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRIVATE_NAV_LINKS, PUBLIC_NAV_LINKS } from '../../constants/constants';
import { Button } from '../button/button';
import { BurgerMenu } from '../burger-menu/burger-menu';
import { Account } from '../../services/account';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Button, BurgerMenu],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  PUBLIC_NAV_LINKS = PUBLIC_NAV_LINKS;
  PRIVATE_NAV_LINKS = PRIVATE_NAV_LINKS;
  accountService = inject(Account);
  activePage: string = '';

  setActivePage(page: string) {
    this.activePage = page;
  }
}
