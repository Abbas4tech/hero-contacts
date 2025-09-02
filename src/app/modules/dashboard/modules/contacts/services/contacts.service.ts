import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    deleteDoc,
    setDoc,
    updateDoc,
    writeBatch,
    query,
    orderBy,
} from '@angular/fire/firestore';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Contact } from '../model/contacts.model';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/services/toaster.service';

@Injectable({
    providedIn: 'root',
})
export class ContactService {
    private user!: User;

    constructor(
        private _auth: AuthService,
        private _firestore: Firestore,
        private _toastr: ToastService
    ) {
        this._auth.user.subscribe((user) => {
            if (user) this.user = user;
        });
    }

    getContacts(): Observable<Contact[]> {
        if (!this.user) throw new Error('User not authenticated');

        const contactsRef = collection(this._firestore, this.user.uid);
        const contactsQuery = query(contactsRef, orderBy('name', 'asc'));
        return collectionData(contactsQuery, { idField: 'id' }) as Observable<
            Contact[]
        >;
    }

    async addContact(data: Contact): Promise<void> {
        if (!this.user) throw new Error('User not authenticated');

        await setDoc(doc(this._firestore, this.user.uid, data.id), data);
        this._toastr.success(`Successfully Added ${data.name} !!`);
    }

    async updateContact(id: string, data: Partial<Contact>): Promise<void> {
        if (!this.user) throw new Error('User not authenticated');

        await updateDoc(doc(this._firestore, this.user.uid, id), data);
        this._toastr.info('Successfully Updated !!');
    }

    async deleteMultiple(ids: string[]): Promise<void> {
        if (!this.user) throw new Error('User not authenticated');

        try {
            const batch = writeBatch(this._firestore);
            ids.forEach((id) => {
                const docRef = doc(this._firestore, this.user.uid, id);
                batch.delete(docRef);
            });

            await batch.commit();
            this._toastr.warning(
                `Successfully deleted ${ids.length} contacts!!`
            );
        } catch (err) {
            console.error(err);
            this._toastr.error('Unable to delete selected contacts');
        }
    }

    async deleteContact(id: string): Promise<void> {
        if (!this.user) throw new Error('User not authenticated');

        await deleteDoc(doc(this._firestore, this.user.uid, id));
        this._toastr.success('Successfully Deleted !!');
    }
}
