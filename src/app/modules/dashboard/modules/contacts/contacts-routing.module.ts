import { ContactResolver } from './resolver/contact.resolver';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ContactsIndexScreen } from './screens/index/index.screen';
import { DetailedContactScreen } from './screens/detailed-contact/detailed-contact';
import { ContactFormPage } from './components/form/form.component';
import { CanActivateEditForm } from './guard/edit-form.guard';
import { ContactsModulePages } from './model/contacts.model';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ContactsIndexScreen,
    },
    {
        path: ContactsModulePages.EDIT_CONTACT,
        component: ContactFormPage,
        resolve: {
            formData: ContactResolver,
        },
        canActivate: [CanActivateEditForm],
    },
    {
        path: ContactsModulePages.ADD_CONTACT,
        component: ContactFormPage,
    },
    {
        path: 'details',
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
