import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserFilesRoutingModule } from './user-files-routing.module';
import { UserFilesScreen } from './screens/index.screen';
import { StorageMeter } from './components/storage-meter/storage-meter.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FilesTable } from './components/table/table.component';
import { Modal } from './components/modal/modal.component';

@NgModule({
    declarations: [
        UserFilesScreen,
        StorageMeter,
        TooltipDirective,
        FilesTable,
        Modal,
    ],
    imports: [CommonModule, UserFilesRoutingModule, SharedModule],
    exports: [TooltipDirective],
})
export class UserFilesModule {
    constructor() {}
}
