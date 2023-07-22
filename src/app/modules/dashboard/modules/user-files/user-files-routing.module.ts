import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { UserFilesScreen } from './screens/index.screen';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: UserFilesScreen,
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
