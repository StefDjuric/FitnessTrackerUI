import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Account } from './services/account';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  accountService = inject(Account);

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }
}
