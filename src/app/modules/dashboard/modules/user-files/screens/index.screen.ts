import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Upload } from '../services/upload';
import { UploadService } from '../services/upload.service';
import {
    FirebaseStorage,
    getBlob,
    getDownloadURL,
    getMetadata,
    getStorage,
    listAll,
    ref,
} from '@angular/fire/storage';
import { initializeApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { StorageFile } from '../model/types';

@Component({
    selector: 'hero-drive',
    templateUrl: './index.screen.html',
})
export class UserFilesScreen implements OnInit {
    user: User;
    selectedFiles: FileList;
    currentUpload: Upload;
    storage: FirebaseStorage;
    files: BehaviorSubject<StorageFile[]> = new BehaviorSubject<StorageFile[]>(
        []
    );
    constructor(
        private _auth: AuthService,
        private _uploadService: UploadService
    ) {
        this.user = this._auth.user.getValue();
    }

    async downloadFile(path: string) {
        const file = await getBlob(ref(this.storage, path));
        console.log(file);
    }

    async ngOnInit() {
        this.storage = getStorage(initializeApp(environment.firebaseConfig));
        const refrence = ref(this.storage, `${this.user.email}`);
        const list = await listAll(refrence);
        const data: StorageFile[] = await Promise.all(
            list.items.map(async (item) => {
                const meta = await getMetadata(item);
                return {
                    ...meta,
                    updated: new Date(meta.updated).toDateString(),
                    url: await getDownloadURL(item),
                };
            })
        );
        this.files.next(data);
    }

    detectFiles(e) {
        this.selectedFiles = e.target.files;
        console.log('Preview', this.selectedFiles);
    }

    uploadSingleFile() {
        const file = this.selectedFiles.item(0);
        this.currentUpload = new Upload(file);
        this._uploadService.pushUpload(this.currentUpload);
    }
}
