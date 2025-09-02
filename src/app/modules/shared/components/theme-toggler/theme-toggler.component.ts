import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { Theme } from 'src/app/types/common-types';

enum THEMES {
    NIGHT = 'night',
    LIGHT = 'light',
}
@Component({
    selector: 'theme-toggler',
    templateUrl: './theme-toggler.component.html',
    standalone: false,
})
export class ThemeToggler implements OnDestroy {
    @Input() panelClass: string = '';
    theme: Theme = THEMES.LIGHT;
    commonEnum = THEMES;
    subscriptions: Subscription[] = [];
    constructor(private _common: CommonService) {
        this.subscriptions.push(
            this._common.theme.subscribe((theme) => (this.theme = theme))
        );
    }
    toggleTheme(event: Event) {
        const target = event.target as HTMLInputElement;
        if (!target.checked) {
            this._common.setTheme(THEMES.LIGHT);
        } else {
            this._common.setTheme(THEMES.NIGHT);
        }
    }
    ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
