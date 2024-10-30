import { Component, Inject, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { updateProfile, User } from '@angular/fire/auth';
import {
    AngularFireStorage,
    AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { TStoFix } from 'src/app/types/common-types';
import { ToastService } from 'src/app/services/toaster.service';
import { Subscription } from 'rxjs';
import {
    AbstractControl,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
} from '@angular/forms';
import { DOCUMENT, Location } from '@angular/common';
import { noSpace } from '../../contacts/validators/validators';
import { CommonService } from 'src/app/services/common.service';
@Component({
    selector: 'profile',
    templateUrl: './index.screen.html',
})
export class IndexProfileScreen implements OnDestroy {
    task: AngularFireUploadTask;
    suscriptions: Subscription[] = [];

    percentage: number;
    user: User;

    updateForm: UntypedFormGroup;
    isLoading: boolean;

    constructor(
        private _auth: AuthService,
        private _fireStorage: AngularFireStorage,
        private _toastr: ToastService,
        private _fb: UntypedFormBuilder,
        private _location: Location,
        private _common: CommonService,
        @Inject(DOCUMENT) private _document: Document
    ) {
        this._common.setTitle('Profile');
        this.suscriptions.push(
            this._auth.user.subscribe((user) => {
                this.user = user;
            })
        );
        this.updateForm = this._fb.group({
            username: new UntypedFormControl(this.user.displayName, [noSpace]),
        });
    }
    selectFile(): void {
        const fileInput = this._document.getElementById('avatar');
        fileInput.click();
    }
    async uploadprofile(event: TStoFix) {
        try {
            const file: Blob = event.target.files[0];
            if (file.type.includes('image/')) {
                const filepath = `${this.user.uid}.png`;
                const fileRef = this._fireStorage.ref(filepath);
                this.task = this._fireStorage.upload(filepath, file, {
                    cacheControl: 'true',
                });

                this.task
                    .percentageChanges()
                    .subscribe((count) => (this.percentage = count));

                const url = (await fileRef
                    .getDownloadURL()
                    .toPromise()) as string;
                await updateProfile(this._auth.user.value, { photoURL: url });
                this._toastr.success('Profile Updated Successfully!');
            } else {
                throw new Error('Please select proper image file');
            }
        } catch (err) {
            console.error(err);
            this._toastr.error(err);
        }
    }

    async submitForm(): Promise<void> {
        if (!this.updateForm.valid) {
            return;
        }
        try {
            this.isLoading = true;
            const { username } = this.updateForm.value;
            await updateProfile(this._auth.user.value, {
                displayName: username,
            });
            this._toastr.success('Profile Updated Successfully');
            this.isLoading = false;
        } catch (err) {
            console.error(err);
            this._toastr.error('Unable to update profile!');
            this.isLoading = false;
        }
    }

    back(): void {
        this._location.back();
    }

    get username(): AbstractControl {
        return this.updateForm.get('username');
    }
    ngOnDestroy(): void {
        this.suscriptions.forEach((sub) => sub.unsubscribe());
    }
}
