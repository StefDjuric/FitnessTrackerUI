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
  @Input() styling: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input() disabled: boolean = false;
  @Input() iconSrc: string | null = null;
  @Input() downloadUrl?: string;
  @Input() downloadFileName?: string;

  @Output() clicked = new EventEmitter<MouseEvent>();

  OnClick(event: MouseEvent) {
    if (!this.disabled) {
      if (this.downloadUrl) {
        this.downloadFromUrl();
      }

      this.clicked.emit(event);
    }
  }

  private downloadFromUrl() {
    if (!this.downloadFileName) return;

    const link = document.createElement('a');
    if (this.downloadUrl) link.href = this.downloadUrl;

    if (this.downloadFileName) link.download = this.downloadFileName;

    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.appendChild(link);
  }
}
