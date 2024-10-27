import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Upload } from '../services/upload';
import { UploadService } from '../services/upload.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
    selector: 'hero-drive',
    templateUrl: './index.screen.html',
})
export class UserFilesScreen implements OnInit {
    user: User;
    images: string[] = [];
    selectedFiles: FileList;
    currentUpload: Upload;
    constructor(
        private _auth: AuthService,
        private _storage: AngularFireStorage,
        private _uploadService: UploadService
    ) {
        this.user = this._auth.user.getValue();
    }

    async ngOnInit() {
        const folderRef = this._storage.storage
            .ref()
            .child(`${this.user.email}`);
        const allFiles = await folderRef.listAll();
        const urls = await Promise.all(
            allFiles.items.map(
                async (fileRef) => await fileRef.getDownloadURL()
            )
        );
        this.images = urls;
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
