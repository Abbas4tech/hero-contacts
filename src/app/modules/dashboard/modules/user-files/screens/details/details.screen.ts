import { StorageFile } from './../../model/types';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FullMetadata } from '@angular/fire/storage';

@Component({
    selector: 'file-details',
    templateUrl: './details.screen.html',
})
export class FileDetailsScreen implements OnInit {
    link: string;
    meta: FullMetadata;
    downloadUrl: string;
    constructor(private _activeRoute: ActivatedRoute) {}

    ngOnInit(): void {
        const { url, blob, ...meta } = this._activeRoute.snapshot.data[
            'file'
        ] as StorageFile;
        this.link = URL.createObjectURL(blob);
        this.meta = meta;
        this.downloadUrl = url;
        console.log(this.link);
    }
}
