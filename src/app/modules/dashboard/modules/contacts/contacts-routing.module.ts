import { ContactResolver } from './resolver/contact.resolver';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ContactsIndexScreen } from './screens/index/index.screen';
import { DetailedContactScreen } from './screens/detailed-contact/detailed-contact';
import { ContactFormPage } from './components/form/form.component';
import { CanActivateEditForm } from './guard/edit-form.guard';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ContactsIndexScreen,
    },
    {
        path: 'details',
        component: ContactFormPage,
        resolve: {
            formData: ContactResolver,
        },
        canActivate: [CanActivateEditForm],
    },
    {
        path: 'view',
        component: DetailedContactScreen,
        resolve: {
            contact: ContactResolver,
        },
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ContactsRoutingModule {}
