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
import { DetailedFileData } from '../model/types';

@Injectable({ providedIn: 'root' })
export class FilesResolver implements Resolve<DetailedFileData> {
    constructor(private _Auth: Auth) {}
    async resolve(route: ActivatedRouteSnapshot): Promise<DetailedFileData> {
        const currentUser = await firstValueFrom(user(this._Auth));
        const fileRef = ref(
            getStorage(),
            `${currentUser.email}/${route.paramMap.get('name')}`
        );
        const file = await getBlob(fileRef);
        const meta = await getMetadata(fileRef);
        const downloadUrl = await getDownloadURL(fileRef);
        return {
            file,
            meta,
            downloadUrl,
        };
    }
}
