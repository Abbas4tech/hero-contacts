import { Contact } from './../../model/contacts.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'detailed-view',
    templateUrl: './detailed-contact.html',
    animations: [],
})
export class DetailedContactScreen implements OnInit {
    contact: Contact;
    constructor(
        public _route: ActivatedRoute,
        private _common: CommonService
    ) {}

    async ngOnInit(): Promise<void> {
        this.contact = this._route.snapshot.data['contact'];
        this._common.setTitle(this.contact.name);
    }
}
