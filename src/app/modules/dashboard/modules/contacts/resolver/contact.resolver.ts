import { Contact, ContactsQueryParams } from '../model/contacts.model';
import { Injectable } from '@angular/core';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { BrowserStorageService } from 'src/app/services/storage.service';
import { ContactService } from '../services/contacts.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContactResolver implements Resolve<Contact> {
    constructor(
        private _fire: Firestore,
        private _browserStorage: BrowserStorageService,
        private _contactService: ContactService
    ) {}
    async resolve(route: ActivatedRouteSnapshot): Promise<Contact> {
        const userId = route.queryParams['uid'];
        console.time('Time to extract document');
        const id = route.queryParams['id'];

        const mode = route.queryParams['mode'];
        console.log(route.queryParams, this._fire, userId, id);
        if (mode === ContactsQueryParams.ADD) return {} as Contact;
        else {
            try {
                const dbDoc = await getDoc(doc(this._fire, userId, id));
                const data = dbDoc.data() as Contact;
                console.timeEnd('Time to extract document');
                return data;
            } catch (err) {
                console.log('Error in firebase data retirvation', err);
                return {} as Contact;
            }
        }
    }
}
