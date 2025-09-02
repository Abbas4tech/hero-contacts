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
    Validators,
    AbstractControl,
    FormControl,
    FormArray,
    FormGroup,
    FormBuilder,
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

type Form = {
    name: FormControl<string>;
    contacts: FormArray<
        FormGroup<{
            email: FormControl<string>;
            phone: FormControl<string>;
        }>
    >;
    status: FormControl<Contactstatus>;
    description: FormControl<string>;
    id: FormControl<string>;
    photoUrl: FormControl<string>;
};

@Component({
    selector: 'add-contact',
    templateUrl: './form.component.html',
    standalone: false,
})
export class ContactFormPage implements OnInit, OnDestroy {
    addContactForm!: FormGroup<Form>;
    statuses: Contactstatus[] = ['active', 'inactive'];
    subs: Subscription[] = [];
    user!: User | null;

    constructor(
        private commonService: CommonService,
        private location: Location,
        private fb: FormBuilder,
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
        if (!this.user) return;
        this.addContactForm = this.fb.group({
            name: this.fb.control('', {
                validators: [Validators.required],
                asyncValidators: this.isEditMode
                    ? []
                    : [shouldUnique(this.user.uid, 'name')],
            }),
            contacts: this.fb.array([this.createContactGroup()]),
            status: this.fb.control<Contactstatus>(
                'active',
                Validators.required
            ),
            description: this.fb.control('', [
                Validators.required,
                descriptionValidator,
            ]),
            id: this.fb.control(`${Math.random()}`),
            photoUrl: this.fb.control(randomAvatarUrlGenerator()),
        }) as FormGroup<Form>;
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
        this.addContactForm.patchValue({
            ...data,
            contacts: [], // We've already handled contacts separately
        });
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
    }): FormGroup<{
        email: FormControl<string>;
        phone: FormControl<string>;
    }> {
        return this.fb.group({
            email: this.fb.control(contact?.email || '', [
                Validators.required,
                Validators.email,
            ]),
            phone: this.fb.control(contact?.phone?.toString() || '', [
                Validators.required,
                Validators.pattern('[0-9]{10}'),
            ]),
        }) as FormGroup<{
            email: FormControl<string>;
            phone: FormControl<string>;
        }>;
    }

    get contacts(): FormArray<
        FormGroup<{
            email: FormControl<string>;
            phone: FormControl<string>;
        }>
    > {
        return this.addContactForm.get('contacts') as FormArray<
            FormGroup<{
                email: FormControl<string>;
                phone: FormControl<string>;
            }>
        >;
    }

    get name(): AbstractControl {
        return this.addContactForm.get('name')!;
    }

    get description(): AbstractControl {
        return this.addContactForm.get('description')!;
    }

    async submit(): Promise<void> {
        if (this.addContactForm.invalid) return;

        const formValue = this.addContactForm.value;
        const contactData: Contact = {
            ...formValue,
            contacts: formValue.contacts!.map((contact) => ({
                email: contact.email!,
                phone: parseInt(contact.phone!, 10),
            })),
        } as Contact;

        try {
            if (this.isEditMode) {
                await this.contactService.updateContact(
                    contactData.id,
                    contactData
                );
            } else {
                await this.contactService.addContact(contactData);
            }

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
