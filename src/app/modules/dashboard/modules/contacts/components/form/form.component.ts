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
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    AbstractControl,
} from '@angular/forms';
import { fadeInOut } from 'src/app/modules/shared/animations/shared.animations';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toaster.service';
import { randomAvatarUrlGenerator } from 'src/app/modules/auth/utils/auth.util';

@Component({
    selector: 'add-contact',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    animations: [fadeInOut],
})
export class ContactFormPage implements OnInit {
    addContactForm: UntypedFormGroup;
    statuses: Contactstatus[] = ['active', 'inactive'];
    mode: string;
    constructor(
        private _common: CommonService,
        private _location: Location,
        private _fb: UntypedFormBuilder,
        private _toastr: ToastService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _conatctSer: ContactService
    ) {
        this.mode = this._route.snapshot.queryParams[ContactsQueryParams.MODE];
        if (this.mode === ContactsQueryParams.ADD) {
            this._common.setTitle('Add');
        } else {
            this._common.setTitle('Edit');
        }
        this.addContactForm = this._fb.group({
            name: this._fb.control('', [Validators.required]),
            contacts: this._fb.array([
                this._fb.group({
                    email: [
                        '',
                        [
                            Validators.required,
                            Validators.pattern(
                                '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'
                            ),
                        ],
                    ],
                    phone: [
                        '',
                        [Validators.required, Validators.pattern('[0-9]{10}')],
                    ],
                }),
            ]),
            status: this._fb.control('active'),
            description: this._fb.control('', [Validators.required]),
            id: Math.random(),
            photoUrl: randomAvatarUrlGenerator(),
        });
    }
    ngOnInit(): void {
        if (
            this._route.snapshot.queryParams[ContactsQueryParams.MODE] ===
            ContactsQueryParams.EDIT
        ) {
            const data: Contact = this._route.snapshot.data['formData'];
            this.addContactForm.setValue({
                id: data.id,
                photoUrl: data.photoUrl,
                name: data.name,
                contacts: data.contacts.map((e) => ({
                    email: e.email,
                    phone: e.phone,
                })),
                status: data.status,
                description: data.description,
            });
        }
    }

    get contacts(): UntypedFormArray {
        return this.addContactForm.get('contacts') as UntypedFormArray;
    }

    async submit(): Promise<void> {
        try {
            if (
                this._route.snapshot.queryParams[ContactsQueryParams.MODE] ===
                ContactsQueryParams.EDIT
            ) {
                await this._conatctSer.updateContact(
                    this.addContactForm.value.id,
                    this.addContactForm.value
                );
            } else {
                const data = { ...this.addContactForm.value } as Contact;
                this._conatctSer.addContact(data);
            }
        } catch (err) {
            console.error(err);
            this._toastr.error(err.message);
        } finally {
            this._router.navigate(['dashboard/contacts']);
            this.addContactForm.reset();
        }
    }

    addPhone(): void {
        const contact = this._fb.group({
            email: [
                '',
                [
                    Validators.required,
                    Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'),
                ],
            ],
            phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
        });
        this.contacts.push(contact);
    }

    removePhone(i: number): void {
        this.contacts.removeAt(i);
    }

    get name(): AbstractControl {
        return this.addContactForm.get('name');
    }

    get phoneNumber(): AbstractControl {
        return this.addContactForm.get('phone');
    }

    get description(): AbstractControl {
        return this.addContactForm.get('description');
    }

    back(): void {
        this._location.back();
    }
}
