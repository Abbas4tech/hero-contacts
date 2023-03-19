import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AbstractControl,
    UntypedFormBuilder,
    UntypedFormControl,
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
        name: new UntypedFormControl('', [
            Validators.required,
            Validators.maxLength(15),
        ]),
        email: new UntypedFormControl('', [Validators.required, Validators.email]),
        password: new UntypedFormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
    });

    isLoading = false;
    isMobile: boolean;
    constructor(
        private _router: Router,
        private _common: CommonService,
        private _fb: UntypedFormBuilder,
        private _auth: AuthService,
        private _toastr: ToastService,
        private _seoService: SeoService
    ) {
        this._common.setTitle('Auth');
        const theme = localStorage.getItem(COMMONENUM.THEME) as Theme;
        if (theme) {
            this._common.setTheme(theme);
        }
        this.subscriptons.push(
            this._common
                .getBrowserWidth()
                .subscribe((width) =>
                    width <= 768
                        ? (this.isMobile = true)
                        : (this.isMobile = false)
                )
        );
        this.setSeoData();
        setTimeout(() => {
            this.isShown = true;
        }, 2000);
    }

    closeBanner(b: boolean) {
        this.isShown = false;
    }

    setSeoData(): void {
        const metaTags = [
            {
                name: 'title',
                content: `My Contcats App - Authentication Page`,
            },
            {
                name: 'description',
                content:
                    'My Contacts is a fast and efficient web app for storing your personal contacts',
            },
            {
                name: 'author',
                content: 'Abbas Shaikh',
            },
            {
                name: 'keywords',
                content: 'angular, app, web-app, pwa',
            },
            {
                name: 'type',
                content: 'website',
            },
        ];
        this._seoService.setTags(metaTags);
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
                    this._toastr.error(err.message);
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
                    this._toastr.error(err.message);
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
                new UntypedFormControl('', [
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
