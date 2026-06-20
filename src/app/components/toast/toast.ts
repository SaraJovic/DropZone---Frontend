import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast',
  imports: [AsyncPipe],
  template: `
    @if (toastService.toast$ | async; as toast) {
      <div class="dz-toast" role="status" aria-live="polite">
        <i class="bi bi-check-circle-fill"></i>
        <span>{{ toast.text }}</span>
      </div>
    }
  `,
  styles: [`
    .dz-toast {
      position: fixed;
      bottom: 2.4rem;
      right: 2.4rem;
      z-index: 2000;
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.4rem 1.8rem;
      background: var(--text-heading);
      color: #FFFFFF;
      font-family: var(--font-heading-family);
      font-size: 1.3rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      border-radius: var(--radius);
      box-shadow: var(--shadow-md);
      animation: toast-slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .dz-toast i {
      color: var(--color-success);
      font-size: 1.6rem;
    }

    @keyframes toast-slide-in {
      from {
        opacity: 0;
        transform: translateY(16px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: 575.98px) {
      .dz-toast {
        left: 1.6rem;
        right: 1.6rem;
        bottom: 1.6rem;
      }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
