import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { IndexProfileScreen } from './screen/index.screen';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: IndexProfileScreen,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfileRoutingModule {
    constructor() {}
}
