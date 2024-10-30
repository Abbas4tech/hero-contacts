import { CardStatus, ContactsQueryParams } from './../../model/contacts.model';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
} from '@angular/core';
import { User } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { LayoutService } from 'src/app/modules/dashboard/services/layout.service';
import { Contact } from '../../model/contacts.model';
import { ContactService } from '../../services/contacts.service';

@Component({
    selector: 'contact-card',
    templateUrl: './contact-card.component.html',
    styleUrls: ['./contact-card.component.scss'],
})
export class ContactCardComponent implements OnDestroy {
    @Input() item: Contact;
    @Output() onCheck = new EventEmitter<CardStatus>();
    user: User;
    private readonly destroy$ = new Subject<void>();

    isMultiSelected = false;

    constructor(
        private layoutService: LayoutService,
        private contactService: ContactService,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService
    ) {
        this.layoutService.selectedCards
            .pipe(takeUntil(this.destroy$))
            .subscribe((cards) => {
                this.isMultiSelected = cards.length > 0;
            });
        this.authService.user.subscribe((user) => (this.user = user));
    }

    onMultiSelect(event: Event): void {
        event.stopPropagation();
        const input = event.target as HTMLInputElement;
        this.onCheck.emit({
            id: input.value,
            checked: input.checked,
        } as CardStatus);
    }

    detailed(id: string, event: Event): void {
        this.navigateWithStopPropagation(event, ['view'], {
            id,
            uid: this.user.uid,
        });
    }

    edit(id: string, event: Event): void {
        this.navigateWithStopPropagation(
            event,
            ['details'],
            {
                [ContactsQueryParams.MODE]: ContactsQueryParams.EDIT,
                id,
                uid: this.user.uid,
            },
            'merge'
        );
    }

    async delete(id: string, event: Event): Promise<void> {
        event.stopPropagation();
        await this.contactService.deleteContact(id);
    }

    private navigateWithStopPropagation(
        event: Event,
        commands: string[],
        queryParams: object,
        queryParamsHandling: 'merge' | 'preserve' = 'preserve'
    ): void {
        event.stopPropagation();
        this.router.navigate(commands, {
            queryParams,
            relativeTo: this.route,
            queryParamsHandling,
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
