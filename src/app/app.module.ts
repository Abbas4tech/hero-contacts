import { environment } from './../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ToastrModule } from 'ngx-toastr';
import { NetworkManagerService } from './services/network-manager.service';
import { SharedModule } from './modules/shared/shared.module';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, GoogleAuthProvider } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AuthService } from './modules/auth/services/auth.service';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { providePerformance, getPerformance } from '@angular/fire/performance';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SharedModule,

        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: true,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
        ToastrModule.forRoot({
            timeOut: 5000,
            progressBar: true,
            progressAnimation: 'increasing',
            titleClass: 'font-heading',
            positionClass: 'toast-bottom-right',
        }),
    ],
    providers: [
        NetworkManagerService,
        AuthService,
        GoogleAuthProvider,
        { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),
        providePerformance(() => getPerformance()),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    // Created a instance of Network Management on overall Application
    constructor(private _network: NetworkManagerService) {}
}
