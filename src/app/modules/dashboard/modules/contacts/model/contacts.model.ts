export interface Contact {
    name: string;
    contacts: ContactsMetaData[];
    photoUrl: string;
    description: string;
    status: Contactstatus;
    id: string;
}

export enum ContactsQueryParams {
    MODE = 'mode',
    ADD = 'add',
    EDIT = 'edit',
    ID = 'id',
    user = 'user',
}

export type CardStatus = { id: string; checked: boolean };
export type Contactstatus = 'active' | 'inactive';

export interface ContactsMetaData {
    phone: number;
    email: string;
}

export enum ContactsModulePages {
    ADD_CONTACT = 'add-contact',
    EDIT_CONTACT = 'edit-contact',
}
