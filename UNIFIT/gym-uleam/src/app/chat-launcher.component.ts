import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './pages/chat/chat.component';

@Component({
  selector: 'app-chat-launcher',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatComponent],
  template: `
    <div *ngIf="showButton" class="chat-launcher">
      <button class="chat-open-btn" (click)="toggleChat()">💬</button>
    </div>

    <div *ngIf="isOpen" class="chat-overlay">
      <div class="chat-modal">
        <div class="chat-modal-header">
          <button class="btn-close" (click)="toggleChat()">✖</button>
        </div>
        <app-chat></app-chat>
      </div>
    </div>
  `,
  styles: [`
    .chat-launcher {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 9999;
    }
    .chat-open-btn {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg,#667eea 0%,#764ba2 100%);
      color: white;
      font-size: 22px;
      box-shadow: 0 6px 18px rgba(102,126,234,0.35);
      cursor: pointer;
    }
    .chat-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
    }
    .chat-modal {
      width: 90%;
      max-width: 900px;
      background: transparent;
    }
    .chat-modal-header {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
    }
    .btn-close {
      background: rgba(255,255,255,0.9);
      border: none;
      padding: 6px 10px;
      border-radius: 8px;
      cursor: pointer;
    }
  `]
})
export class ChatLauncherComponent {
  private router = inject(Router);
  isOpen = false;

  get showButton(): boolean {
    // Ocultar el botón en la ruta de login
    try {
      const url = this.router.url || '';
      return !url.startsWith('/login');
    } catch {
      return true;
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }
}
