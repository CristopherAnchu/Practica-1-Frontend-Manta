import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  toolsExecuted?: any[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <h2>🤖 Asistente UNIFIT AI</h2>
        <p class="subtitle">Powered by MCP (Model Context Protocol)</p>
      </div>

      <div class="chat-messages" #messagesContainer>
        <div *ngFor="let message of messages" 
             [class]="'message message-' + message.role">
          <div class="message-avatar">
            {{ message.role === 'user' ? '👤' : '🤖' }}
          </div>
          <div class="message-content">
            <div class="message-text">{{ message.content }}</div>
            <div class="message-time">
              {{ message.timestamp | date: 'short' }}
            </div>
            <div *ngIf="message.toolsExecuted && message.toolsExecuted.length > 0" 
                 class="tools-executed">
              <strong>🔧 Herramientas ejecutadas:</strong>
              <ul>
                <li *ngFor="let tool of message.toolsExecuted">
                  {{ tool.name }} - {{ tool.result }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div *ngIf="isLoading" class="message message-ai loading">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input-container">
        <div class="file-upload" *ngIf="selectedFile">
          <span>📎 {{ selectedFile.name }}</span>
          <button (click)="removeFile()" class="btn-remove">✖</button>
        </div>
        
        <div class="input-row">
          <input 
            type="file" 
            #fileInput 
            (change)="onFileSelected($event)" 
            accept="image/*,application/pdf"
            style="display: none">
          
          <button (click)="fileInput.click()" 
                  class="btn-attach" 
                  title="Adjuntar imagen o PDF">
            📎
          </button>

          <input 
            type="text" 
            [(ngModel)]="currentMessage" 
            (keyup.enter)="sendMessage()"
            placeholder="Pregunta algo sobre tus reservas, rutinas, estadísticas..."
            class="chat-input"
            [disabled]="isLoading">

          <button (click)="sendMessage()" 
                  class="btn-send" 
                  [disabled]="!currentMessage.trim() && !selectedFile || isLoading">
            Enviar
          </button>
        </div>

        <div class="suggestions">
          <button *ngFor="let suggestion of suggestions" 
                  (click)="useSuggestion(suggestion)"
                  class="btn-suggestion">
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 600px;
      max-width: 800px;
      margin: 20px auto;
      border: 1px solid #ddd;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .chat-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      text-align: center;
    }

    .chat-header h2 {
      margin: 0 0 5px 0;
      font-size: 24px;
    }

    .subtitle {
      margin: 0;
      opacity: 0.9;
      font-size: 14px;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #f5f7fa;
    }

    .message {
      display: flex;
      margin-bottom: 16px;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message-avatar {
      font-size: 32px;
      margin-right: 12px;
    }

    .message-content {
      max-width: 70%;
      padding: 12px 16px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .message-user .message-content {
      background: #667eea;
      color: white;
      margin-left: auto;
    }

    .message-user {
      flex-direction: row-reverse;
    }

    .message-user .message-avatar {
      margin-right: 0;
      margin-left: 12px;
    }

    .message-text {
      margin-bottom: 4px;
    }

    .message-time {
      font-size: 11px;
      opacity: 0.7;
    }

    .tools-executed {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(0,0,0,0.1);
      font-size: 13px;
    }

    .tools-executed ul {
      margin: 5px 0 0 0;
      padding-left: 20px;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      background: #667eea;
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;
    }

    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    .chat-input-container {
      padding: 16px;
      background: white;
      border-top: 1px solid #ddd;
    }

    .file-upload {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: #f0f0f0;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    .input-row {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }

    .chat-input {
      flex: 1;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
    }

    .btn-attach, .btn-send, .btn-remove {
      padding: 12px 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-attach {
      background: #f0f0f0;
      font-size: 18px;
    }

    .btn-send {
      background: #667eea;
      color: white;
    }

    .btn-send:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-remove {
      background: #ff4444;
      color: white;
      font-size: 12px;
      padding: 4px 8px;
    }

    .suggestions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn-suggestion {
      padding: 6px 12px;
      border: 1px solid #667eea;
      background: white;
      color: #667eea;
      border-radius: 16px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-suggestion:hover {
      background: #667eea;
      color: white;
    }
  `]
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  currentMessage: string = '';
  isLoading: boolean = false;
  selectedFile: File | null = null;

  suggestions = [
    '¿Cuántas reservas tengo hoy?',
    'Crear una rutina de fuerza',
    'Mostrar estadísticas del gimnasio',
    'Reservar clase de spinning'
  ];

  private aiApiUrl = `${environment.aiOrchestratorUrl}/chat`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.messages.push({
      role: 'ai',
      content: '¡Hola! Soy el asistente de UNIFIT. Puedo ayudarte con tus reservas, crear rutinas personalizadas, y mostrarte estadísticas. ¿En qué puedo ayudarte?',
      timestamp: new Date()
    });
  }

  async sendMessage(): Promise<void> {
    if ((!this.currentMessage.trim() && !this.selectedFile) || this.isLoading) {
      return;
    }

    const userMessage = this.currentMessage;
    this.messages.push({
      role: 'user',
      content: userMessage || '📎 [Archivo adjunto]',
      timestamp: new Date()
    });

    this.isLoading = true;
    this.currentMessage = '';

    try {
      let response: any;

      if (this.selectedFile) {
        // Enviar con multimodal endpoint
        const formData = new FormData();
        formData.append('message', userMessage);
        formData.append('file', this.selectedFile);
        formData.append('userId', this.getUserId());

        response = await this.http.post(`${environment.aiOrchestratorUrl}/chat/multimodal`, formData).toPromise();
        this.selectedFile = null;
      } else {
        // Enviar solo texto
        response = await this.http.post(this.aiApiUrl, {
          message: userMessage,
          userId: this.getUserId()
        }).toPromise();
      }

      this.messages.push({
        role: 'ai',
        content: response.response || response.message,
        timestamp: new Date(),
        toolsExecuted: response.toolCalls || []
      });

    } catch (error: any) {
      this.messages.push({
        role: 'ai',
        content: `Error: ${error.error?.message || 'No se pudo procesar tu solicitud'}`,
        timestamp: new Date()
      });
    } finally {
      this.isLoading = false;
      this.scrollToBottom();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  useSuggestion(suggestion: string): void {
    this.currentMessage = suggestion;
    this.sendMessage();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = document.querySelector('.chat-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  private getUserId(): string {
    // Obtener del localStorage o AuthService
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 'guest';
  }
}
