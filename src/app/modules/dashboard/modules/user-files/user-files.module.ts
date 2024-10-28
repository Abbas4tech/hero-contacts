import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserFilesRoutingModule } from './user-files-routing.module';
import { UserFilesScreen } from './screens/index.screen';
import { StorageMeter } from './components/storage-meter/storage-meter.component';

@NgModule({
    declarations: [UserFilesScreen, StorageMeter],
    imports: [CommonModule, UserFilesRoutingModule],
    exports: [],
})
export class UserFilesModule {
    constructor() {}
}
