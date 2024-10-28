import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { StorageFile } from '../model/types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'hero-drive',
    templateUrl: './index.screen.html',
})
export class UserFilesScreen implements OnInit, OnDestroy {
    files: StorageFile[] = [];
    private destroy$ = new Subject<void>();

    constructor(private _uploadService: StorageService) {}

    ngOnInit(): void {
        this._uploadService.storageState$
            .pipe(takeUntil(this.destroy$))
            .subscribe((state) => {
                this.files = state.files;
            });
    }

    detectFiles(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target?.files) {
            this._uploadService.detectFiles(target.files);
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
