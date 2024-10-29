import { LayoutService } from 'src/app/modules/dashboard/services/layout.service';
import { CommonService } from 'src/app/services/common.service';
import {
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';

import { CardStatus, Contact } from '../../model/contacts.model';
import { ContactService } from '../../services/contacts.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'contacts-screen',
    templateUrl: './index.screen.html',
})
export class ContactsIndexScreen implements OnInit, OnDestroy {
    list: Contact[];
    subs: Subscription;
    isMultiSelected!: boolean;
    subscriptions: Subscription[] = [];
    cards: CardStatus[];
    @ViewChild('addContactTemplate')
    addContactTemplate: TemplateRef<HTMLElement[]>;
    constructor(
        private _common: CommonService,
        private _layout: LayoutService,
        private _contactService: ContactService
    ) {
        this._common.setTitle('Contacts');
    }
    async ngOnInit(): Promise<void> {
        if (this.subs) {
            this.subs.unsubscribe();
        }
        setTimeout(() => {
            this._common.updateTemplate(this.addContactTemplate);
        });
        this.subs = this._contactService
            .getContacts()
            .subscribe((data) => (this.list = data));
        this.subscriptions.push(this.subs);
        this.subscriptions.push(
            this._layout.selectedCards.subscribe((cards) => {
                this.cards = cards;
                if (cards.length >= 1) {
                    this.isMultiSelected = true;
                } else {
                    this.isMultiSelected = false;
                }
            })
        );
    }

    async deleteSelected(): Promise<void> {
        try {
            const idsToDelete = this.cards.map((e) => e.id);
            await this._contactService.deleteMultiple(idsToDelete);
            this._layout.selectedCards.next(
                this._layout.selectedCards.value.filter(
                    (e) => !idsToDelete.includes(e.id)
                )
            );
        } catch (err) {
            console.error(err);
        }
    }
    async onCheck({ id, checked }: CardStatus): Promise<void> {
        if (checked) {
            if (!this.cards.some((card) => card.id === id)) {
                this.cards.push({ id, checked });
            }
        } else {
            const index = this.cards.findIndex((card) => card.id === id);
            if (index !== -1) {
                this.cards.splice(index, 1);
            }
        }
        this._layout.selectedCards.next(this.cards);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((e) => e.unsubscribe());
        this._common.updateTemplate(null);
    }
}
