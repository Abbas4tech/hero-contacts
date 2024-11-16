import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
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
export class FilesResolver implements Resolve<StorageFile> {
    constructor(
        private _Auth: Auth,
        private _storage: StorageService
    ) {}
    async resolve(route: ActivatedRouteSnapshot): Promise<StorageFile> {
        const storage = await firstValueFrom(this._storage.storageState$);

        if (storage) {
            const { files } = storage;
            return files.find((e) => e.name === route.paramMap.get('name'));
        }

        const currentUser = await firstValueFrom(user(this._Auth));
        const fileRef = ref(
            getStorage(),
            `${currentUser.email}/${route.paramMap.get('name')}`
        );
        const blob = await getBlob(fileRef);
        const meta = await getMetadata(fileRef);
        const url = await getDownloadURL(fileRef);
        return {
            ...meta,
            blob,
            url,
        };
    }
}
