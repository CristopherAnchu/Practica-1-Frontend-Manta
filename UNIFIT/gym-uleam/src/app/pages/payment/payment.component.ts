import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  createdAt: Date;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="payment-container">
      <div class="payment-header">
        <h2>💳 Procesar Pago</h2>
        <p>Sistema de pagos UNIFIT con múltiples pasarelas</p>
      </div>

      <div class="payment-form" *ngIf="!paymentSuccess">
        <div class="form-group">
          <label>Concepto</label>
          <select [(ngModel)]="paymentData.description" class="form-control">
            <option value="Mensualidad">Mensualidad Gimnasio</option>
            <option value="Clase Especial">Clase Especial</option>
            <option value="Entrenador Personal">Entrenador Personal</option>
            <option value="Nutrición">Plan de Nutrición</option>
          </select>
        </div>

        <div class="form-group">
          <label>Monto (USD)</label>
          <input 
            type="number" 
            [(ngModel)]="paymentData.amount" 
            class="form-control"
            min="1"
            step="0.01">
        </div>

        <div class="form-group">
          <label>Método de Pago</label>
          <div class="payment-methods">
            <div 
              class="payment-method" 
              [class.active]="paymentData.provider === 'stripe'"
              (click)="selectProvider('stripe')">
              <div class="method-icon">💳</div>
              <div class="method-name">Stripe</div>
            </div>
            <div 
              class="payment-method" 
              [class.active]="paymentData.provider === 'mock'"
              (click)="selectProvider('mock')">
              <div class="method-icon">🧪</div>
              <div class="method-name">Mock (Test)</div>
            </div>
          </div>
        </div>

        <button 
          (click)="processPayment()" 
          class="btn-pay"
          [disabled]="isProcessing || !isFormValid()">
          {{ isProcessing ? 'Procesando...' : 'Procesar Pago $' + paymentData.amount }}
        </button>

        <div class="info-box">
          <strong>ℹ️ Información:</strong>
          <ul>
            <li><strong>Stripe:</strong> Pasarela real (requiere API key)</li>
            <li><strong>Mock:</strong> Simulación para pruebas</li>
          </ul>
        </div>
      </div>

      <div class="payment-success" *ngIf="paymentSuccess">
        <div class="success-icon">✅</div>
        <h3>¡Pago Exitoso!</h3>
        <p>ID de Transacción: <strong>{{ currentPayment?.id }}</strong></p>
        <p>Monto: <strong>\${{ currentPayment?.amount }} {{ currentPayment?.currency }}</strong></p>
        <p>Estado: <strong>{{ currentPayment?.status }}</strong></p>
        <button (click)="resetForm()" class="btn-new">Nuevo Pago</button>
      </div>

      <div class="payment-history">
        <h3>📜 Historial de Pagos</h3>
        <div class="history-empty" *ngIf="paymentHistory.length === 0">
          No hay pagos registrados
        </div>
        <div class="history-list" *ngIf="paymentHistory.length > 0">
          <div *ngFor="let payment of paymentHistory" class="history-item">
            <div class="item-info">
              <strong>{{ payment.description }}</strong>
              <span class="item-amount">\${{ payment.amount }}</span>
            </div>
            <div class="item-meta">
              <span class="badge" [class]="'badge-' + payment.status">
                {{ payment.status }}
              </span>
              <span class="item-date">{{ payment.createdAt | date: 'short' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
    }

    .payment-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .payment-header h2 {
      color: #333;
      margin-bottom: 8px;
    }

    .payment-header p {
      color: #666;
      font-size: 14px;
    }

    .payment-form {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
    }

    .payment-methods {
      display: flex;
      gap: 12px;
    }

    .payment-method {
      flex: 1;
      padding: 20px;
      border: 2px solid #ddd;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .payment-method:hover {
      border-color: #667eea;
      transform: translateY(-2px);
    }

    .payment-method.active {
      border-color: #667eea;
      background: #f0f4ff;
    }

    .method-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .method-name {
      font-weight: 600;
      color: #333;
    }

    .btn-pay {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-pay:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-pay:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .info-box {
      margin-top: 20px;
      padding: 12px;
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      border-radius: 4px;
      font-size: 13px;
    }

    .info-box ul {
      margin: 8px 0 0 0;
      padding-left: 20px;
    }

    .payment-success {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
      margin-bottom: 30px;
    }

    .success-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .payment-success h3 {
      color: #28a745;
      margin-bottom: 16px;
    }

    .payment-success p {
      margin: 8px 0;
      color: #666;
    }

    .btn-new {
      margin-top: 20px;
      padding: 12px 24px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .payment-history {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .payment-history h3 {
      margin-bottom: 16px;
      color: #333;
    }

    .history-empty {
      text-align: center;
      padding: 40px;
      color: #999;
    }

    .history-item {
      padding: 16px;
      border-bottom: 1px solid #eee;
    }

    .history-item:last-child {
      border-bottom: none;
    }

    .item-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .item-amount {
      font-weight: 600;
      color: #28a745;
    }

    .item-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: 600;
    }

    .badge-succeeded {
      background: #d4edda;
      color: #155724;
    }

    .badge-pending {
      background: #fff3cd;
      color: #856404;
    }

    .badge-failed {
      background: #f8d7da;
      color: #721c24;
    }

    .item-date {
      color: #999;
    }
  `]
})
export class PaymentComponent implements OnInit {
  paymentData = {
    amount: 50,
    currency: 'USD',
    description: 'Mensualidad',
    provider: 'mock'
  };

  isProcessing = false;
  paymentSuccess = false;
  currentPayment: Payment | null = null;
  paymentHistory: Payment[] = [];

  private paymentApiUrl = `${environment.paymentServiceUrl}/payments`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPaymentHistory();
  }

  selectProvider(provider: string): void {
    this.paymentData.provider = provider;
  }

  isFormValid(): boolean {
    return this.paymentData.amount > 0 && this.paymentData.description.length > 0;
  }

  async processPayment(): Promise<void> {
    if (!this.isFormValid() || this.isProcessing) return;

    this.isProcessing = true;

    try {
      const response: any = await this.http.post(this.paymentApiUrl, {
        ...this.paymentData,
        userId: this.getUserId()
      }).toPromise();

      this.currentPayment = response;
      this.paymentSuccess = true;
      this.paymentHistory.unshift(response);
      this.savePaymentHistory();

    } catch (error: any) {
      alert(`Error al procesar pago: ${error.error?.message || 'Error desconocido'}`);
    } finally {
      this.isProcessing = false;
    }
  }

  resetForm(): void {
    this.paymentSuccess = false;
    this.currentPayment = null;
    this.paymentData = {
      amount: 50,
      currency: 'USD',
      description: 'Mensualidad',
      provider: 'mock'
    };
  }

  private loadPaymentHistory(): void {
    const stored = localStorage.getItem('paymentHistory');
    if (stored) {
      this.paymentHistory = JSON.parse(stored);
    }
  }

  private savePaymentHistory(): void {
    localStorage.setItem('paymentHistory', JSON.stringify(this.paymentHistory));
  }

  private getUserId(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 'guest';
  }
}
