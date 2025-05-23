import { StorageFile } from './../../model/types';
import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FullMetadata } from '@angular/fire/storage';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from '../../services/storage.service';
import { Location } from '@angular/common';

@Component({
    selector: 'file-details',
    templateUrl: './details.screen.html',
    standalone: false
})
export class FileDetailsScreen implements OnInit, OnDestroy, AfterViewInit {
    link: string;
    meta: FullMetadata;
    downloadUrl: string;

    @ViewChild('detailsTemplate') detailsTemplate: TemplateRef<HTMLElement[]>;

    constructor(
        private _activeRoute: ActivatedRoute,
        private _common: CommonService,
        private _storage: StorageService,
        private _location: Location
    ) {}

    ngOnInit(): void {
        const data = this._activeRoute.snapshot.data['file'] as StorageFile;
        const { url, blob, ...meta } = data;
        this._common.setTitle(meta.name);
        this.link = URL.createObjectURL(blob);
        this.meta = meta;
        this.downloadUrl = url;
    }

    ngAfterViewInit(): void {
        this._common.updateTemplate(this.detailsTemplate);
    }

    ngOnDestroy(): void {
        this._common.updateTemplate(null);
    }

    async delete(path: string): Promise<void> {
        await this._storage.deleteFile(path);
        this._location.back();
    }
}
