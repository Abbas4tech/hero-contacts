import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserFilesRoutingModule } from './user-files-routing.module';
import { UserFilesScreen } from './screens/index.screen';
import { StorageMeter } from './components/storage-meter/storage-meter.component';
import { TooltipDirective } from './directives/tooltip.directive';

@NgModule({
    declarations: [UserFilesScreen, StorageMeter, TooltipDirective],
    imports: [CommonModule, UserFilesRoutingModule],
    exports: [TooltipDirective],
})
export class UserFilesModule {
    constructor() {}
}
