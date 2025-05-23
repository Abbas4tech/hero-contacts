import {
    Component,
    OnDestroy,
    ViewChild,
    ElementRef,
    inject,
} from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { updateProfile, User, deleteUser } from '@angular/fire/auth';
import {
    FirebaseStorage,
    getDownloadURL,
    ref,
    uploadBytesResumable,
    Storage,
} from '@angular/fire/storage';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    FormBuilder,
} from '@angular/forms';

import { noSpace } from '../../contacts/validators/validators';
import { CommonService } from 'src/app/services/common.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ToastService } from 'src/app/services/toaster.service';
import { StorageService } from '../../user-files/services/storage.service';

@Component({
    selector: 'profile',
    templateUrl: './index.screen.html',
    standalone: false,
})
export class IndexProfileScreen implements OnDestroy {
    suscriptions: Subscription[] = [];
    @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
    percentage: number;
    user: User;
    private storage: FirebaseStorage = inject(Storage);
    updateForm: FormGroup<{ username: FormControl<string> }>;
    isLoading: boolean;

    constructor(
        private _auth: AuthService,
        private _toastr: ToastService,
        private _fb: FormBuilder,
        private _location: Location,
        private _common: CommonService,
        private _storage: StorageService
    ) {
        this._common.setTitle('Profile');
        this.suscriptions.push(
            this._auth.user.subscribe((user) => {
                this.user = user;
            })
        );
        this.updateForm = this._fb.group({
            username: new FormControl(this.user.displayName, [noSpace]),
        });
    }
    selectFile(): void {
        this.fileInput.nativeElement.click();
    }
    async uploadprofile(event: Event) {
        try {
            const target = event.target as HTMLInputElement;
            const file: Blob = target.files[0];
            this._storage.detectFiles(target.files);
            if (file.type.includes('image/')) {
                const filepath = `${this.user.uid}.png`;
                const refs = ref(this.storage, filepath);
                const uploadTask = uploadBytesResumable(refs, file);
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        this.percentage = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                                100
                        );
                    },
                    (error) => {
                        console.error('Upload failed:', error);
                        this._toastr.error(error.message);
                    },
                    async () => {
                        const url = await getDownloadURL(
                            uploadTask.snapshot.ref
                        );
                        await updateProfile(this._auth.user.value, {
                            photoURL: url,
                        });
                        this._toastr.success('Profile Updated Successfully!');
                    }
                );
            } else {
                throw new Error('Please select proper image file');
            }
        } catch (err) {
            console.error(err);
            this._toastr.error(err);
        }
    }

    async deleteUser() {
        await deleteUser(this.user);
        this._location.back();
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
