import { DetailedFileData } from './../../model/types';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'file-details',
    templateUrl: './details.screen.html',
})
export class FileDetailsScreen implements OnInit {
    link: string;
    fileName: string;
    constructor(private _activeRoute: ActivatedRoute) {}

    ngOnInit(): void {
        const { file, meta } = this._activeRoute.snapshot.data[
            'file'
        ] as DetailedFileData;
        this.link = URL.createObjectURL(file);
        this.fileName = meta.name;
        console.log(this.link);
    }
}
