import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { StorageFile } from '../model/types';
import { Subject } from 'rxjs';

@Component({
    selector: 'hero-drive',
    templateUrl: './index.screen.html',
})
export class UserFilesScreen implements OnDestroy {
    files: StorageFile[] = [];
    private destroy$ = new Subject<void>();
    @ViewChild('fileInput') fileElement: ElementRef<HTMLInputElement>;

    constructor(private _uploadService: StorageService) {}

    detectFiles(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target?.files) {
            this._uploadService.detectFiles(target.files);
            this._uploadService.uploadSingleFile();
        }
    }

    uploadSingleFile(): void {
        this._uploadService.uploadSingleFile();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    trackByFileName(index: number, file: StorageFile): string {
        return file.name;
    }
}
