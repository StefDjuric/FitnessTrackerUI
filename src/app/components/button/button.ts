import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  standalone: true,
  styleUrl: './button.css',
})
export class Button {
  @Input() text: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() styling: 'primary' | 'secondary' = 'primary';
  @Input() disabled: boolean = false;
  @Input() iconSrc: string | null = null;

  @Output() clicked = new EventEmitter<MouseEvent>();

  OnClick(event: MouseEvent) {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
