import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from './services/websocket.service';
import { ChatLauncherComponent } from './chat-launcher.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatLauncherComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('gym-uleam');
  private websocket = inject(WebsocketService);

  ngOnInit(): void {
    // Conectar al WebSocket al iniciar la aplicación
    this.websocket.connect('http://localhost:8080');
  }
}
