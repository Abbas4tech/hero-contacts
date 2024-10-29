import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Subject, takeUntil } from 'rxjs';
import { StorageFile } from '../../model/types';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'files-table',
    templateUrl: './table.component.html',
})
export class FilesTable implements OnInit {
    files: StorageFile[] = [];
    private destroy$ = new Subject<void>();
    constructor(
        private _uploadService: StorageService,
        private _router: Router,
        private _activeRoute: ActivatedRoute
    ) {}

    showDetails(name: string) {
        console.log('Details Ran');
        this._router.navigate(['dashboard/files/details'], {
            queryParams: {
                name,
            },
        });
    }

    async deleteFile(path: string) {
        await this._uploadService.deleteFile(path);
    }

    ngOnInit(): void {
        this._uploadService.storageState$
            .pipe(takeUntil(this.destroy$))
            .subscribe((state) => {
                this.files = state.files;
            });
    }
}
