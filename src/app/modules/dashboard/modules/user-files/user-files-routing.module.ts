import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFilesScreen } from './screens/index.screen';
import { FileDetailsScreen } from './screens/details/details.screen';
import { FilesTable } from './components/table/table.component';

const routes: Routes = [
    {
        path: '',
        component: UserFilesScreen,
        children: [
            {
                path: 'all',
                component: FilesTable,
            },
            {
                path: 'details',
                component: FileDetailsScreen,
            },
            {
                path: '**',
                redirectTo: 'all',
            },
        ],
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
