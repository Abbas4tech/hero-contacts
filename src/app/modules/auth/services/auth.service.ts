import { errorGenerator, randomAvatarUrlGenerator } from './../utils/auth.util';
import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
    Auth,
    signInWithPopup,
    signOut,
    User,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    updateProfile,
    signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import {
    BehaviorSubject,
    catchError,
    from,
    map,
    tap,
    throwError,
    Observable,
} from 'rxjs';
import { BrowserStorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toaster.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
    constructor(
        private _auth: Auth,
        private _toastr: ToastService,
        private _router: Router,
        private _provider: GoogleAuthProvider,
        private _browserStorage: BrowserStorageService
    ) {
        this._auth.onAuthStateChanged((user) => {
            if (user) {
                this.user.next(user);
                this._browserStorage.set('userId', user.uid);
            }
        });
    }

    async signUp(
        fullname: string,
        email: string,
        password: string
    ): Promise<void> {
        try {
            const userCreds = await createUserWithEmailAndPassword(
                this._auth,
                email,
                password
            );
            await updateProfile(userCreds.user, {
                displayName: fullname,
                photoURL: randomAvatarUrlGenerator(),
            });
            this.user.next(userCreds.user);
            this._browserStorage.set('userId', userCreds.user.uid);
            this._router.navigate(['dashboard/contacts']);
            this._toastr.success(`Logged In as ${this.user.value.displayName}`);
        } catch (err) {
            if (err instanceof FirebaseError) {
                const errorMessage = errorGenerator(err.message);
                this._toastr.error(errorMessage);
            }
        }
    }

    signInWithGoogle(): Observable<User> {
        return from(signInWithPopup(this._auth, this._provider)).pipe(
            map(({ user }) => user),
            tap((data) => {
                this.user.next(data);
                this._browserStorage.set('userId', data.uid);
            }),
            catchError((err: FirebaseError) => throwError(err))
        );
    }

    signIn(email: string, password: string): Observable<User> {
        return from(
            signInWithEmailAndPassword(this._auth, email, password)
        ).pipe(
            map(({ user }) => user),
            tap((data) => this.user.next(data)),
            catchError((err) => throwError(err))
        );
    }

    async signOut(): Promise<void> {
        try {
            await signOut(this._auth);
            this.user.next(null);
            this._browserStorage.clean('userId');
            this._router.navigate(['auth']);
            this._toastr.success('Loggedout successfully');
        } catch (error) {
            console.error(error);
            this._toastr.error('Loggingout failed!');
        }
    }
}
