import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AbstractControl,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ToastService } from 'src/app/services/toaster.service';
import { COMMONENUM, Theme } from 'src/app/types/common-types';
import { AuthService } from '../services/auth.service';
import { SeoService } from 'src/app/services/seo.service';
import { errorGenerator } from '../utils/auth.util';
import { BrowserStorageService } from 'src/app/services/storage.service';
import { FirebaseError } from '@angular/fire/app';

@Component({
    selector: 'index',
    templateUrl: './index.component.html',
    providers: [AuthService],
    standalone: false,
})
export class IndexComponent implements OnInit, OnDestroy {
    isSignUp = true;
    subscriptons: Subscription[] = [];

    isShown = false;
    authForm = this.fb.group({
        name: new UntypedFormControl('', [
            Validators.required,
            Validators.maxLength(15),
        ]),
        email: new UntypedFormControl('', [
            Validators.required,
            Validators.email,
        ]),
        password: new UntypedFormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
    });

    isLoading = false;

    constructor(
        private router: Router,
        private commonService: CommonService,
        private fb: UntypedFormBuilder,
        private authService: AuthService,
        private toastr: ToastService,
        private seoService: SeoService,
        private _browserStorgage: BrowserStorageService
    ) {
        this.authForm = this.createAuthForm();
        this.initialize();
    }

    private createAuthForm(): UntypedFormGroup {
        return this.fb.group({
            name: [''],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    private initialize(): void {
        this.commonService.setTitle('Auth');
        const theme = this._browserStorgage.get(COMMONENUM.THEME) as Theme;
        if (theme) {
            this.commonService.setTheme(theme);
        }
        this.seoService.setSeoData();
    }

    get email(): AbstractControl {
        return this.authForm.get('email')!;
    }

    get password(): AbstractControl {
        return this.authForm.get('password')!;
    }

    get name(): AbstractControl {
        return this.authForm.get('name')!;
    }

    signInWithGoogle(): void {
        this.setLoading(true);
        this.subscriptons.push(
            this.authService.signInWithGoogle().subscribe({
                next: (value) => {
                    this.router.navigate(['dashboard/contacts']);
                    this.setLoading(false);
                },
                error: (err) => {
                    this.handleError(err);
                },
            })
        );
    }

    async submitForm(): Promise<void> {
        const { email, password, name } = this.authForm.value as Record<
            string,
            string
        >;
        this.isSignUp
            ? await this.signUp(name, email, password)
            : await this.signIn(email, password);
    }

    private async signIn(email: string, password: string): Promise<void> {
        this.setLoading(true);
        this.subscriptons.push(
            this.authService.signIn(email, password).subscribe({
                next: () => {
                    this.router.navigate(['dashboard/contacts']);
                    this.authForm.reset();
                    this.setLoading(false);
                },
                error: (err) => {
                    this.handleError(err);
                },
            })
        );
    }

    private async signUp(
        name: string,
        email: string,
        password: string
    ): Promise<void> {
        this.setLoading(true);
        try {
            await this.authService.signUp(name, email, password);
            this.authForm.reset();
        } catch (err) {
            this.handleError(err as FirebaseError);
        }
    }

    toggleMode(): void {
        this.isSignUp = !this.isSignUp;
        if (this.isSignUp) {
            this.authForm.addControl(
                'name',
                new UntypedFormControl('', [
                    Validators.required,
                    Validators.maxLength(15),
                ])
            );
        } else {
            this.authForm.removeControl('name');
        }
    }

    ngOnDestroy(): void {
        this.subscriptons.forEach((subs) => subs.unsubscribe());
    }

    ngOnInit(): void {}

    private handleError(err: FirebaseError): void {
        this.setLoading(false);
        this.toastr.error(errorGenerator(err.message));
        this.authForm.reset();
    }

    private setLoading(loading: boolean): void {
        this.isLoading = loading;
    }

    goToDashboard(): void {
        this.router.navigate(['dashboard']);
    }
}
