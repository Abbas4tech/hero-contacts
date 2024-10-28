import { Injectable, OnInit } from '@angular/core';
import { Upload } from './upload';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ToastService } from 'src/app/services/toaster.service';
import {
    FirebaseStorage,
    getDownloadURL,
    getStorage,
    ref,
    StorageReference,
    uploadBytesResumable,
} from '@angular/fire/storage';
import { initializeApp } from '@firebase/app';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UploadService implements OnInit {
    storage: FirebaseStorage;
    fileReference: StorageReference;
    constructor(private _toastr: ToastService, private _auth: AuthService) {
        this.storage = getStorage(initializeApp(environment.firebaseConfig));
    }

    private _basePath = `${this._auth.user.value.email}`;

    pushUpload(upload: Upload) {
        this.fileReference = ref(
            this.storage,
            `${this._basePath}/${upload.file.name}`
        );
        const uploadItem = uploadBytesResumable(
            this.fileReference,
            upload.file
        );
        uploadItem.on(
            'state_changed',
            (snapshot) => {
                upload.progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (err) => {
                console.error(err);
                this._toastr.error(err.message);
            },
            async () => {
                upload.url = await getDownloadURL(uploadItem.snapshot.ref);
                upload.name = upload.file.name;
                this._toastr.success(
                    `Successfully Uploaded ${upload.file.name} !!`
                );
            }
        );
    }

    ngOnInit(): void {}
}
