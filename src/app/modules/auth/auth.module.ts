import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { IndexComponent } from './screen/index.component';
import { AuthService } from './services/auth.service';

@NgModule({
    declarations: [IndexComponent],
    imports: [
        CommonModule,
        AuthRoutingModule,
        SharedModule,
        ReactiveFormsModule,
    ],
    exports: [],
    providers: [AuthService],
})
export class AuthModule {}
