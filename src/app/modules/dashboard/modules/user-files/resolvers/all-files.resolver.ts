import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { StorageFile } from '../model/types';
import { StorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class AllFilesResolver implements Resolve<StorageFile[]> {
    constructor(private _storage: StorageService) {}
    async resolve(): Promise<StorageFile[]> {
        await this._storage.loadStorageFiles();
        const { files } = await firstValueFrom(this._storage.storageState$);
        return files;
    }
}
