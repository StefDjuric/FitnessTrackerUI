import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PUBLIC_NAV_LINKS } from '../../constants/constants';
import { Button } from '../button/button';
import { BurgerMenu } from '../burger-menu/burger-menu';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Button, BurgerMenu],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  PUBLIC_NAV_LINKS = PUBLIC_NAV_LINKS;
}
