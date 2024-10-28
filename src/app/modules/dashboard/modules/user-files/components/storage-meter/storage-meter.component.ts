import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageFile } from '../../model/types';
import { StorageService } from '../../services/storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'storage-meter',
    template: `
        <div class="flex py-2 flex-col gap-3">
            <progress
                class="progress progress-success w-56"
                [value]="percentageConsumption"
                max="100"
            ></progress>
            <p>
                {{ currentConsumptionInFormat }} of
                {{ maxBucketConsumptionInFormat }}
            </p>
        </div>
    `,
})
export class StorageMeter implements OnInit, OnDestroy {
    files: StorageFile[] = [];
    currentConsumption = 0;
    currentConsumptionInFormat = '';
    maxBucketConsumptionInFormat = '';
    percentageConsumption = 0;

    private destroy$ = new Subject<void>();

    constructor(private _storageService: StorageService) {}

    ngOnInit(): void {
        this.maxBucketConsumptionInFormat =
            this._storageService.maxBucketSizeInFormat;

        this._storageService.storageState$
            .pipe(takeUntil(this.destroy$))
            .subscribe((state) => {
                this.files = state.files;
                if (state.totalConsumption !== this.currentConsumption) {
                    this.currentConsumption = state.totalConsumption;
                    this.currentConsumptionInFormat =
                        this._storageService.formatBytes(
                            this.currentConsumption
                        );
                    this.updatePercentageConsumption();
                }
            });
    }

    private updatePercentageConsumption(): void {
        this.percentageConsumption =
            (this.currentConsumption /
                this._storageService.maxBucketSizeInBytes) *
            100;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
