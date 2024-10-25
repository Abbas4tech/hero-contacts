import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ToastService } from 'src/app/services/toaster.service';
import { COMMONENUM, Theme } from 'src/app/types/common-types';
import { fadeInOut } from '../../shared/animations/shared.animations';
import { AuthService } from '../services/auth.service';
import { SeoService } from 'src/app/services/seo.service';
import { errorGenerator } from '../utils/auth.util';

@Component({
    selector: 'index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    animations: [fadeInOut],
    providers: [AuthService],
})
export class IndexComponent implements OnInit, OnDestroy {
    isSignUp = true;
    subscriptons: Subscription[] = [];

    isShown = false;
    authForm = this._fb.group({
        name: new FormControl('', [
            Validators.required,
            Validators.maxLength(15),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
    });

    isLoading = false;
    constructor(
        private _router: Router,
        private _common: CommonService,
        private _fb: FormBuilder,
        private _auth: AuthService,
        private _toastr: ToastService,
        private _seoService: SeoService
    ) {
        this._common.setTitle('Auth');
        const theme = localStorage.getItem(COMMONENUM.THEME) as Theme;
        if (theme) {
            this._common.setTheme(theme);
        }
        this._seoService.setSeoData();
        setTimeout(() => {
            this.isShown = true;
        }, 2000);
    }

    closeBanner(b: boolean) {
        this.isShown = false;
    }

    get email(): AbstractControl {
        return this.authForm.get('email');
    }

    get password(): AbstractControl {
        return this.authForm.get('password');
    }

    get name(): AbstractControl {
        return this.authForm.get('name');
    }
    signInWithGoogle(): void {
        this.isLoading = true;
        this.subscriptons.push(
            this._auth.signInWithGoogle().subscribe({
                next: (value) => {
                    this._router.navigate(['dashboard/contacts']);
                    this._toastr.success(`Signed in as ${value.displayName}`);
                    this.isLoading = false;
                },
                error: (err) => {
                    this.isLoading = false;
                    console.log(err.message);
                    this._toastr.error(errorGenerator(err.message));
                },
                complete: () => {},
            })
        );
    }

    async submitForm(): Promise<void> {
        const { email, password, name } = this.authForm.value;
        if (this.isSignUp) {
            this.signUp(name, email, password);
        } else {
            this.signIn(email, password);
        }
    }

    async signIn(email: string, password: string): Promise<void> {
        this.isLoading = true;
        this.subscriptons.push(
            this._auth.signIn(email, password).subscribe({
                next: (value) => {
                    this._router.navigate(['dashboard/contacts']);
                    this._toastr.success(`Loggedin Successfully!`);
                    this.authForm.reset();
                    this.isLoading = false;
                },
                error: (err) => {
                    this.isLoading = false;
                    this._toastr.error(errorGenerator(err.message));
                    this.authForm.reset();
                },
            })
        );
    }

    async signUp(name: string, email: string, password: string): Promise<void> {
        try {
            this.isLoading = true;
            await this._auth.signUp(name, email, password);
            this.authForm.reset();
            this.isLoading = false;
        } catch (err) {
            console.error(err);
            this._toastr.error(errorGenerator(err.message));
            this.isLoading = false;
        }
    }

    toggleMode(): void {
        this.isSignUp = !this.isSignUp;
        if (!this.isSignUp) {
            this.authForm.removeControl('name', { emitEvent: true });
        } else {
            this.authForm.addControl(
                'name',
                new FormControl('', [
                    Validators.required,
                    Validators.maxLength(15),
                ]),
                {
                    emitEvent: true,
                }
            );
        }
    }
    ngOnDestroy(): void {
        this.subscriptons.forEach((subs) => subs.unsubscribe());
    }

    ngOnInit(): void {}
    goToDashboard(): void {
        this._router.navigate(['dashboard']);
    }
}
