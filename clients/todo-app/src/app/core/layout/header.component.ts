import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Bell, User } from 'lucide-angular';
import { LanguageSelectorComponent } from '../../shared/components/language-selector/language-selector.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TranslateModule, LanguageSelectorComponent],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="header-title">{{ 'layout.appName' | translate }}</h1>
        </div>

        <div class="header-right">
          <app-language-selector></app-language-selector>
          <button class="header-icon-btn" title="Notifications">
            <lucide-icon [img]="Bell" [size]="20" [strokeWidth]="2"></lucide-icon>
          </button>
          <button class="header-icon-btn" title="Profile">
            <lucide-icon [img]="User" [size]="20" [strokeWidth]="2"></lucide-icon>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      right: 0;
      left: var(--sidebar-width);
      height: var(--header-height);
      background-color: var(--color-header-bg);
      border-bottom: 1px solid var(--color-header-border);
      z-index: 10;
      box-shadow: var(--shadow-sm);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 1.5rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .header-icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
      background: transparent;
      border: none;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .header-icon-btn:hover {
      background-color: var(--color-surface-hover);
      color: var(--color-text-primary);
    }

    @media (max-width: 768px) {
      .header {
        left: 0;
      }

      .header-title {
        font-size: 1rem;
      }
    }
  `]
})
export class HeaderComponent {
  readonly Bell = Bell;
  readonly User = User;
}
