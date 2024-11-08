import {
    Component,
    OnDestroy,
    ViewChild,
    ElementRef,
    OnInit,
    TemplateRef,
    AfterContentChecked,
    AfterViewInit,
} from '@angular/core';
import { StorageService } from '../services/storage.service';
import { StorageFile } from '../model/types';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'hero-drive',
    templateUrl: './index.screen.html',
})
export class UserFilesScreen implements OnInit, OnDestroy, AfterViewInit {
    files: StorageFile[] = [];
    private destroy$ = new Subject<void>();
    @ViewChild('fileInput') fileElement: ElementRef<HTMLInputElement>;
    @ViewChild('uploadTemplate')
    uploadTemplate: TemplateRef<HTMLElement[]>;

    constructor(
        private _uploadService: StorageService,
        private _common: CommonService,
        private _route: ActivatedRoute
    ) {}

    detectFiles(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target?.files) {
            this._uploadService.detectFiles(target.files);
            this._uploadService.uploadSingleFile();
        }
    }

    ngOnInit(): void {
        const data = this._route.snapshot.data['allFiles'];
        console.log(data);
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this._common.updateTemplate(this.uploadTemplate);
        });
    }

    uploadSingleFile(): void {
        this._uploadService.uploadSingleFile();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this._common.updateTemplate(null);
    }

    trackByFileName(index: number, file: StorageFile): string {
        return file.name;
    }
}
