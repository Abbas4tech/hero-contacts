import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFilesScreen } from './screens/index.screen';
import { FileDetailsScreen } from './screens/details/details.screen';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: UserFilesScreen,
    },
    {
        path: 'details',
        pathMatch: 'full',
        component: FileDetailsScreen,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserFilesRoutingModule {
    constructor() {}
}
