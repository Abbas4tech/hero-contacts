import {
    ActivatedRouteSnapshot,
    MaybeAsync,
    Resolve,
    ResolveFn,
    RouterStateSnapshot,
} from '@angular/router';
import { StorageFile } from '../model/types';
import { inject, Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class FilesResolver implements Resolve<StorageFile> {
    constructor(
        private _auth: AuthService,
        private _storage: StorageService
    ) {}
    async resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<StorageFile> {
        console.log(this._auth.user.getValue());
        return (await firstValueFrom(this._storage.storageState$)).files.find(
            (item) => item.name === route.paramMap.get('name')
        );
    }
}
