import { Contact, ContactsQueryParams } from '../model/contacts.model';
import { Injectable } from '@angular/core';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class ContactResolver implements Resolve<Contact> {
    constructor(private _fire: Firestore, private _auth: AuthService) {}
    async resolve(route: ActivatedRouteSnapshot): Promise<Contact> {
        const id = route.queryParams['id'];
        const mode = route.queryParams['mode'];
        if (mode === ContactsQueryParams.ADD) return {} as Contact;
        const userId = this._auth.user.getValue().uid;
        const dbDoc = await getDoc(doc(this._fire, userId, id));
        return dbDoc.data() as Contact;
    }
}
