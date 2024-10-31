import { CardStatus, ContactsQueryParams } from './../../model/contacts.model';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild,
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
    @ViewChild('multiSelectCheckbox')
    multiSelectCheckbox: ElementRef<HTMLInputElement>;
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
        this.authService.user
            .pipe(takeUntil(this.destroy$))
            .subscribe((user) => {
                this.user = user;
            });
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
        this.navigateWithStopPropagation(event, ['details'], {
            id,
            uid: this.user.uid,
        });
    }

    edit(id: string, event: Event): void {
        this.navigateWithStopPropagation(event, ['edit-contact'], {
            [ContactsQueryParams.MODE]: ContactsQueryParams.EDIT,
            id,
            uid: this.user.uid,
        });
    }

    async delete(id: string, event: Event): Promise<void> {
        event.stopPropagation();
        await this.contactService.deleteContact(id);
    }

    private navigateWithStopPropagation(
        event: Event,
        commands: string[],
        queryParams: object
    ): void {
        event.stopPropagation();
        this.router.navigate(commands, {
            queryParams,
            relativeTo: this.route,
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
