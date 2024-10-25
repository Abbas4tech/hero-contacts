import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import {
    list,
    ref,
    getDownloadURL,
    Storage,
    getBlob,
} from '@angular/fire/storage';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
    selector: 'hero-drive',
    templateUrl: './index.screen.html',
})
export class UserFilesScreen implements OnInit {
    user: User;
    images: string[] = [];
    constructor(private _auth: AuthService, private _storage: Storage) {
        this.user = this._auth.user.getValue();
    }
    async ngOnInit() {
        const results = await list(ref(this._storage, `${this.user.uid}`), {
            maxResults: 10,
        });
        const urls = await Promise.all(
            results.items.map((item) => getDownloadURL(item))
        );
        console.log(urls);
        this.images = urls;
    }
}
