import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardScreen } from './screen/index.screen';

const routes: Routes = [
    {
        path: '',
        component: DashboardScreen,
        children: [
            {
                path: 'contacts',
                loadChildren: () =>
                    import('./modules/contacts/contacts.module').then(
                        (m) => m.ContactsModule
                    ),
            },
            {
                path: 'files',
                loadChildren: () =>
                    import('./modules/user-files/user-files.module').then(
                        (m) => m.UserFilesModule
                    ),
            },
            {
                path: 'profile',
                loadChildren: () =>
                    import('./modules/profile/profile.module').then(
                        (m) => m.ProfileModule
                    ),
            },
        ],
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
