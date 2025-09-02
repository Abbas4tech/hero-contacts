import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'page-wrapper',
    templateUrl: './page-wrapper.component.html',
    standalone: false,
})
export class PageWrapper implements OnInit, OnDestroy {
    dynamicTemplate!: TemplateRef<HTMLElement[]>;
    subs: Subscription = new Subscription();
    constructor(private _shared: CommonService) {}

    ngOnInit(): void {
        this.subs = this._shared.currentTemplate.subscribe((template) => {
            if (template) this.dynamicTemplate = template;
        });
    }
    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
