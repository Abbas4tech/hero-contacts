import { ContactService } from '../../services/contacts.service';
import {
    Contactstatus,
    ContactsQueryParams,
    Contact,
} from '../../model/contacts.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import {
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    AbstractControl,
} from '@angular/forms';
import { User } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toaster.service';
import { randomAvatarUrlGenerator } from 'src/app/modules/auth/utils/auth.util';
import {
    descriptionValidator,
    shouldUnique,
} from '../../validators/validators';

import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'add-contact',
    templateUrl: './form.component.html',
})
export class ContactFormPage implements OnInit, OnDestroy {
    addContactForm: UntypedFormGroup;
    statuses: Contactstatus[] = ['active', 'inactive'];
    subs: Subscription[] = [];
    user: User;
    constructor(
        private commonService: CommonService,
        private location: Location,
        private fb: UntypedFormBuilder,
        private toastr: ToastService,
        private router: Router,
        private route: ActivatedRoute,
        private contactService: ContactService,
        private _auth: AuthService
    ) {
        this.commonService.setTitle(this.isEditMode ? 'Edit' : 'Add');
        this.subs.push(
            this._auth.user.subscribe((value) => (this.user = value))
        );
    }

    ngOnInit(): void {
        this.initForm();
        if (this.isEditMode) this.loadContactData();
    }

    private initForm(): void {
        this.addContactForm = this.fb.group({
            name: [
                '',
                [Validators.required],
                [shouldUnique(this.user.uid, 'name')],
            ],
            contacts: this.fb.array([this.createContactGroup()]),
            status: ['active'],
            description: ['', [Validators.required, descriptionValidator]],
            id: Math.random(),
            photoUrl: randomAvatarUrlGenerator(),
        });
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => s.unsubscribe());
    }

    private loadContactData(): void {
        const data = this.route.snapshot.data['formData'] as Contact;
        this.contacts.clear();
        data.contacts.forEach((contact) =>
            this.contacts.push(this.createContactGroup(contact))
        );
        this.addContactForm.patchValue(data);
    }

    get isEditMode(): boolean {
        return (
            this.route.snapshot.queryParams[ContactsQueryParams.MODE] ===
            ContactsQueryParams.EDIT
        );
    }

    private createContactGroup(contact?: {
        email: string;
        phone: number;
    }): UntypedFormGroup {
        return this.fb.group({
            email: [
                contact?.email || '',
                [Validators.required, Validators.email],
            ],
            phone: [
                contact?.phone || '',
                [Validators.required, Validators.pattern('[0-9]{10}')],
            ],
        });
    }

    get contacts(): UntypedFormArray {
        return this.addContactForm.get('contacts') as UntypedFormArray;
    }

    get name(): AbstractControl {
        return this.addContactForm.get('name');
    }

    get description(): AbstractControl {
        return this.addContactForm.get('description');
    }

    async submit(): Promise<void> {
        const contactData = this.addContactForm.value as Contact;
        try {
            this.isEditMode
                ? await this.contactService.updateContact(
                      contactData.id,
                      contactData
                  )
                : await this.contactService.addContact(contactData);

            this.router.navigate(['dashboard/contacts']);
            this.addContactForm.reset();
        } catch (err) {
            console.error('Error submitting form:', err);
            this.toastr.error('An error occurred while saving the contact.');
        }
    }

    addPhone(): void {
        this.contacts.push(this.createContactGroup());
    }

    removePhone(index: number): void {
        this.contacts.removeAt(index);
    }

    back(): void {
        this.location.back();
    }
}
