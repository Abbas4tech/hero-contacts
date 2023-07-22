import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserFilesRoutingModule } from './user-files-routing.module';
import { UserFilesScreen } from './screens/index.screen';

@NgModule({
    declarations: [UserFilesScreen],
    imports: [CommonModule, UserFilesRoutingModule],
    exports: [],
})
export class UserFilesModule {
    constructor() {}
}
