import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { StorageFile } from '../../model/types';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserStorageService } from 'src/app/services/storage.service';

@Component({
    selector: 'files-table',
    templateUrl: './table.component.html',
    standalone: false,
})
export class FilesTable implements OnInit, OnDestroy {
    files: StorageFile[] = [];
    subs: Subscription = new Subscription();
    showConsent = true;
    private destroy$ = new Subject<void>();
    constructor(
        private _uploadService: StorageService,
        private _router: Router,
        private route: ActivatedRoute,
        private _browserStorage: BrowserStorageService
    ) {
        this.showConsent = !Boolean(this._browserStorage.get('filesConsent'));
    }

    closeConsent(): void {
        this.showConsent = false;
        this._browserStorage.set('filesConsent', 'true');
    }

    showDetails(name: string) {
        this._router.navigate([name], { relativeTo: this.route });
    }

    async deleteFile(e: MouseEvent, path: string) {
        e.stopPropagation();
        await this._uploadService.deleteFile(path);
    }

    ngOnInit(): void {
        this.subs = this._uploadService.storageState$
            .pipe(takeUntil(this.destroy$))
            .subscribe((state) => {
                this.files = state.files;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.subs.unsubscribe();
    }
}
