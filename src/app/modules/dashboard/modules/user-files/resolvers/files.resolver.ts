import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
    UrlTree,
    Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Auth, user } from '@angular/fire/auth';
import {
    getBlob,
    getDownloadURL,
    getMetadata,
    getStorage,
    ref,
} from '@angular/fire/storage';

import { StorageFile } from '../model/types';
import { StorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class FilesResolver implements Resolve<StorageFile | UrlTree> {
    constructor(
        private _Auth: Auth,
        private _storage: StorageService,
        private router: Router
    ) {}

    async resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<StorageFile | UrlTree> {
        const storage = await firstValueFrom(this._storage.storageState$);

        if (storage) {
            const file = storage.files.find(
                (e) => e.name === route.paramMap.get('name')
            );
            if (file) {
                return file;
            }
        }

        const currentUser = await firstValueFrom(user(this._Auth));
        if (!currentUser) {
            // Redirect to login if no user is authenticated
            return this.router.createUrlTree(['/auth']);
        }

        const fileName = route.paramMap.get('name');
        if (!fileName) {
            // Redirect to a safe page if no filename is provided
            return this.router.createUrlTree(['/dashboard']);
        }

        const fileRef = ref(getStorage(), `${currentUser.email}/${fileName}`);

        try {
            const blob = await getBlob(fileRef);
            const meta = await getMetadata(fileRef);
            const url = await getDownloadURL(fileRef);

            return {
                ...meta,
                blob,
                url,
            } as StorageFile;
        } catch (error) {
            console.error('Error fetching file:', error);
            // Redirect to a safe page if file cannot be fetched
            return this.router.createUrlTree(['/dashboard']);
        }
    }
}
