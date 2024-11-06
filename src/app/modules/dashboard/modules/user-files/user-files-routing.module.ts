import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFilesScreen } from './screens/index.screen';
import { FileDetailsScreen } from './screens/details/details.screen';
import { FilesResolver } from './resolvers/files.resolver';
import { AllFilesResolver } from './resolvers/all-files.resolver';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: UserFilesScreen,
        resolve: {
            allFiles: AllFilesResolver,
        },
    },
    {
        path: ':name',
        pathMatch: 'full',
        component: FileDetailsScreen,
        resolve: {
            file: FilesResolver,
        },
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
