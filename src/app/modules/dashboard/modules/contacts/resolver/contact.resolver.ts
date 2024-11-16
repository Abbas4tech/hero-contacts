import { Contact, ContactsQueryParams } from '../model/contacts.model';
import { Injectable } from '@angular/core';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ContactResolver implements Resolve<Contact> {
    constructor(private _fire: Firestore) {}
    async resolve(route: ActivatedRouteSnapshot): Promise<Contact> {
        const userId = route.queryParams['uid'];
        const id = route.queryParams['id'];

        const mode = route.queryParams['mode'];
        if (mode === ContactsQueryParams.ADD) return {} as Contact;
        else {
            try {
                const dbDoc = await getDoc(doc(this._fire, userId, id));
                const data = dbDoc.data() as Contact;
                return data;
            } catch (err) {
                console.error('Error in firebase data retirvation', err);
                return {} as Contact;
            }
        }
    }
}
