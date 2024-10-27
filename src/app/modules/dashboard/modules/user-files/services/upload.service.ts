import { Injectable } from '@angular/core';
import {
    AngularFireStorage,
    createUploadTask,
} from '@angular/fire/compat/storage';
import { Upload } from './upload';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ToastService } from 'src/app/services/toaster.service';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    constructor(
        private _fireStorage: AngularFireStorage,
        private _toastr: ToastService,
        private _auth: AuthService
    ) {}

    private _basePath = `${this._auth.user.value.email}`;

    pushUpload(upload: Upload) {
        const storageRef = this._fireStorage.storage.ref();
        const uplaodTask = storageRef
            .child(`${this._basePath}/${upload.file.name}`)
            .put(upload.file);

        createUploadTask(uplaodTask)
            .snapshotChanges()
            .subscribe({
                next: (value) => {
                    upload.progress =
                        (value.bytesTransferred / value.totalBytes) * 100;
                },
                error: (err) => {
                    console.error(err);
                    this._toastr.error(err.message);
                },
                complete: async () => {
                    upload.url = await uplaodTask.snapshot.ref.getDownloadURL();
                    upload.name = upload.file.name;
                    this._toastr.success(
                        `Successfully Uploaded ${upload.file.name} !!`
                    );
                },
            });
    }
}
