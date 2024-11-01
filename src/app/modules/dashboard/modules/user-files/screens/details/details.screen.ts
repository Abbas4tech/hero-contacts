import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'file-details',
    templateUrl: './details.screen.html',
})
export class FileDetailsScreen implements OnInit {
    constructor(private _activeRoute: ActivatedRoute) {}

    ngOnInit(): void {
        console.log(this._activeRoute.snapshot.data['file']);
    }
}
