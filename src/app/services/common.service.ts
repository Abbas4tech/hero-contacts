import { Inject, Injectable, TemplateRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { COMMONENUM, Theme } from 'src/app/types/common-types';
import { BrowserStorageService } from './storage.service';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    theme: BehaviorSubject<Theme> = new BehaviorSubject<Theme>('light');
    private templateSource = new BehaviorSubject<TemplateRef<
        HTMLElement[]
    > | null>(null);
    currentTemplate = this.templateSource.asObservable();
    constructor(
        private _title: Title,
        private _browserStorage: BrowserStorageService,
        @Inject(DOCUMENT) private _documnent: Document
    ) {}
    setTitle(newTitle: string) {
        this._title.setTitle(`${newTitle} | My Contacts`);
    }
    setTheme(theme: string): void {
        const HtmlTag = this._documnent.querySelector('html');
        if (HtmlTag) {
            HtmlTag.setAttribute('data-theme', theme);
            this._browserStorage.set(COMMONENUM.THEME, theme);
            this.theme.next(theme as Theme);
        }
    }

    updateTemplate(template: TemplateRef<HTMLElement[]> | null) {
        this.templateSource.next(template);
    }
}
