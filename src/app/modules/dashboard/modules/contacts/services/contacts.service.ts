import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Contact } from '../model/contacts.model';
import {
    Firestore,
    doc,
    deleteDoc,
    setDoc,
    updateDoc,
    DocumentData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/services/toaster.service';

@Injectable({
    providedIn: 'root',
})
export class ContactService {
    user: User;
    list: AngularFirestoreCollection<Contact>;
    constructor(
        private _auth: AuthService,
        private _afc: AngularFirestore,
        private _fire: Firestore,
        private _toastr: ToastService
    ) {
        this._auth.user.subscribe((user) => {
            this.user = user;
        });
    }

    getContacts(): Observable<Contact[]> {
        this.list = this._afc.collection<Contact>(`${this.user.uid}`, (ref) => {
            return ref.orderBy('name', 'asc');
        });
        return this.list.valueChanges();
    }
    async addContact(data: Contact): Promise<void> {
        await setDoc(doc(this._fire, `${this.user.uid}`, `${data.id}`), data);
        this._toastr.success(`Successfully Added ${data.name} !!`);
    }

    async updateContact(id: string, data: Contact): Promise<void> {
        await updateDoc(
            doc(this._fire, `${this.user.uid}`, `${id}`),
            data as DocumentData
        );
        this._toastr.info('Successfully Updated !!');
    }
    async deleteMultiple(ids: string[]): Promise<void> {
        try {
            this.list = this._afc.collection(`${this.user.uid}`);
            const batch = this._afc.firestore.batch();
            ids.forEach((id) => {
                const docRef = this.list.doc(id).ref;
                batch.delete(docRef);
            });

            await batch.commit();
            this._toastr.warning(`Succfully deleted ${ids.length} contacts!!`);
        } catch (err) {
            console.error(err);
            this._toastr.error('Unable to delete selected contacts');
        }
    }

    async deleteContact(id: string): Promise<void> {
        await deleteDoc(doc(this._fire, `${this.user.uid}`, `${id}`));
        this._toastr.success('Successfully Deleted !!');
    }
}
