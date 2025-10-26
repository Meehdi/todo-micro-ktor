import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-selector">
      <button
        (click)="changeLanguage('en')"
        [class.active]="currentLang === 'en'"
        class="lang-button"
        title="English">
        <span class="flag">🇺🇸</span>
      </button>
      <button
        (click)="changeLanguage('fr')"
        [class.active]="currentLang === 'fr'"
        class="lang-button"
        title="Français">
        <span class="flag">🇫🇷</span>
      </button>
    </div>
  `,
  styles: [`
    .language-selector {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .lang-button {
      background: transparent;
      border: 2px solid transparent;
      border-radius: 0.375rem;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lang-button:hover {
      background-color: var(--color-neutral-100);
      border-color: var(--color-neutral-300);
    }

    .lang-button.active {
      border-color: var(--color-primary);
      background-color: var(--color-primary-light);
    }

    .flag {
      font-size: 1.5rem;
      line-height: 1;
      display: block;
    }

    @media (prefers-color-scheme: dark) {
      .lang-button:hover {
        background-color: var(--color-neutral-800);
        border-color: var(--color-neutral-600);
      }
    }
  `]
})
export class LanguageSelectorComponent {
  private translate = inject(TranslateService);

  get currentLang(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'en';
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('selectedLanguage', lang);
  }
}
