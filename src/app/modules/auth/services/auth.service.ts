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
    throwError,
    Observable,
} from 'rxjs';
import { BrowserStorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toaster.service';
import { errorGenerator, randomAvatarUrlGenerator } from './../utils/auth.util';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

    constructor(
        private auth: Auth,
        private toastr: ToastService,
        private router: Router,
        private googleProvider: GoogleAuthProvider,
        private storage: BrowserStorageService
    ) {
        this.auth.onAuthStateChanged(async (user) => {
            if (user) {
                this.setUser(user);
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
                this.auth,
                email,
                password
            );
            await updateProfile(userCreds.user, {
                displayName: fullname,
                photoURL: randomAvatarUrlGenerator(),
            });
            this.setUser(userCreds.user, `Logged In as ${fullname}`);
            this.router.navigate(['dashboard/contacts']);
        } catch (err) {
            this.handleAuthError(err);
        }
    }

    signInWithGoogle(): Observable<User> {
        return from(signInWithPopup(this.auth, this.googleProvider)).pipe(
            map(({ user }) => {
                this.setUser(user, `Signed in as ${user.displayName}`);
                return user;
            }),
            catchError((err: FirebaseError) => this.handleAuthError(err))
        );
    }

    signIn(email: string, password: string): Observable<User> {
        return from(
            signInWithEmailAndPassword(this.auth, email, password)
        ).pipe(
            map(({ user }) => {
                this.setUser(user, `Welcome back, ${user.displayName}`);
                return user;
            }),
            catchError((err) => this.handleAuthError(err))
        );
    }

    async signOut(): Promise<void> {
        try {
            await signOut(this.auth);
            this.clearUser();
            this.router.navigate(['auth']);
            this.toastr.success('Logged out successfully');
        } catch (error) {
            console.error(error);
            this.toastr.error('Log out failed');
        }
    }

    private setUser(user: User, message?: string): void {
        this.user.next(user);
        this.storage.set('userId', user.uid);
        if (message) this.toastr.success(message);
    }

    private clearUser(): void {
        this.user.next(null);
        this.storage.clean('userId');
    }

    private handleAuthError(error: FirebaseError): Observable<never> {
        const errorMessage = errorGenerator(error.message);
        this.toastr.error(errorMessage);
        return throwError(error);
    }
}
