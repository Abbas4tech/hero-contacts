import { ContactService } from '../../services/contacts.service';
import {
    Contactstatus,
    ContactsQueryParams,
    Contact,
} from '../../model/contacts.model';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toaster.service';
import { randomAvatarUrlGenerator } from 'src/app/modules/auth/utils/auth.util';
import { descriptionValidator } from '../../validators/validators';

@Component({
    selector: 'add-contact',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class ContactFormPage implements OnInit {
    addContactForm: FormGroup;
    statuses: Contactstatus[] = ['active', 'inactive'];
    mode: string;

    constructor(
        private commonService: CommonService,
        private location: Location,
        private fb: FormBuilder,
        private toastr: ToastService,
        private router: Router,
        private route: ActivatedRoute,
        private contactService: ContactService
    ) {
        this.mode = this.route.snapshot.queryParams[ContactsQueryParams.MODE];
        this.commonService.setTitle(
            this.mode === ContactsQueryParams.ADD ? 'Add' : 'Edit'
        );
    }

    ngOnInit(): void {
        this.initForm();
        if (this.isEditMode()) {
            this.loadContactData();
        }
    }

    private initForm(): void {
        this.addContactForm = this.fb.group({
            name: ['', Validators.required],
            contacts: this.fb.array([this.createContactGroup()]),
            status: ['active'],
            description: ['', [Validators.required, descriptionValidator]],
            id: Math.random(),
            photoUrl: randomAvatarUrlGenerator(),
        });
    }

    private loadContactData(): void {
        const data = this.route.snapshot.data['formData'] as Contact;
        this.contacts.clear();
        data.contacts.forEach((contact) =>
            this.contacts.push(this.createContactGroup(contact))
        );

        this.addContactForm.patchValue({
            id: data.id,
            photoUrl: data.photoUrl,
            name: data.name,
            status: data.status,
            description: data.description,
        });
    }

    private isEditMode(): boolean {
        return this.mode === ContactsQueryParams.EDIT;
    }

    private createContactGroup(contact?: {
        email: string;
        phone: number;
    }): FormGroup {
        return this.fb.group({
            email: [
                contact?.email || '',
                [
                    Validators.required,
                    Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'),
                ],
            ],
            phone: [
                contact?.phone || '',
                [Validators.required, Validators.pattern('[0-9]{10}')],
            ],
        });
    }

    get contacts(): FormArray {
        return this.addContactForm.get('contacts') as FormArray;
    }

    get name(): AbstractControl {
        return this.addContactForm.get('name');
    }

    get description(): AbstractControl {
        return this.addContactForm.get('description');
    }

    async submit(): Promise<void> {
        console.log('Submit Ran');
        try {
            const contactData = { ...this.addContactForm.value } as Contact;
            this.isEditMode()
                ? await this.contactService.updateContact(
                      contactData.id,
                      contactData
                  )
                : await this.contactService.addContact(contactData);

            this.router.navigate(['dashboard/contacts']);
            this.addContactForm.reset();
        } catch (err) {
            console.log(this.addContactForm);
            console.error(err);
            this.toastr.error(err.message);
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
