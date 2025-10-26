import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { LayoutComponent } from './core/layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private translate = inject(TranslateService);
  private http = inject(HttpClient);
  protected readonly title = signal('todo-app');

  ngOnInit() {
    // Set default language
    this.translate.setDefaultLang('en');

    // Load translation files
    this.loadTranslations();

    // Try to get language from localStorage, otherwise use browser language or default to 'en'
    const savedLang = localStorage.getItem('selectedLanguage');
    const browserLang = this.translate.getBrowserLang();
    const langToUse = savedLang || (browserLang && ['en', 'fr'].includes(browserLang) ? browserLang : 'en');

    this.translate.use(langToUse);
  }

  private loadTranslations() {
    // Load English translations
    this.http.get('./assets/i18n/en.json').subscribe(
      (translations: any) => {
        this.translate.setTranslation('en', translations);
      }
    );

    // Load French translations
    this.http.get('./assets/i18n/fr.json').subscribe(
      (translations: any) => {
        this.translate.setTranslation('fr', translations);
      }
    );
  }
}
