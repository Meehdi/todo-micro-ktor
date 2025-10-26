import { Component, LOCALE_ID, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-selector">
      <button
        (click)="changeLanguage('en')"
        [class.active]="currentLang === 'en' || currentLang === 'en-US'"
        class="lang-button"
        title="English"
        i18n-title="@@language.english">
        <span class="flag">🇺🇸</span>
      </button>
      <button
        (click)="changeLanguage('fr')"
        [class.active]="currentLang === 'fr'"
        class="lang-button"
        title="Français"
        i18n-title="@@language.french">
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
  private document = inject(DOCUMENT);
  currentLang = inject(LOCALE_ID);

  changeLanguage(lang: string) {
    // Store the selected language
    localStorage.setItem('selectedLanguage', lang);

    // Get the current path
    const currentPath = this.document.location.pathname;

    // Reload with the new locale path
    // For runtime locale switching with built-in i18n, we need to reload the page
    // The actual implementation depends on your deployment strategy
    // For now, just reload the page and let the app initialization handle locale detection
    this.document.location.reload();
  }
}
