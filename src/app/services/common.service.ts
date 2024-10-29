import { Injectable, TemplateRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { COMMONENUM, Theme } from 'src/app/types/common-types';
import { BrowserStorageService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    theme: BehaviorSubject<Theme> = new BehaviorSubject<Theme>('light');
    private templateSource = new BehaviorSubject<TemplateRef<any> | null>(null);
    currentTemplate = this.templateSource.asObservable();
    constructor(
        private _title: Title,
        private _browserStorage: BrowserStorageService
    ) {}
    setTitle(newTitle: string) {
        this._title.setTitle(`${newTitle} | My Contacts`);
    }
    setTheme(theme: string): void {
        const HtmlTag = document.querySelector('html');
        if (HtmlTag) {
            HtmlTag.setAttribute('data-theme', theme);
            this._browserStorage.set(COMMONENUM.THEME, theme);
            this.theme.next(theme as Theme);
        }
    }

    updateTemplate(template: TemplateRef<any>) {
        this.templateSource.next(template);
    }
}
