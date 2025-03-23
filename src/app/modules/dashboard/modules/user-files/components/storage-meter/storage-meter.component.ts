import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
    selector: 'storage-meter',
    template: `
        <div
            [data-tip]="
                currentConsumptionInFormat +
                ' of ' +
                maxBucketConsumptionInFormat
            "
            class="flex relative gap-3 items-center text-sm tooltip-primary tooltip tooltip-bottom cursor-pointer"
        >
            <span class="font-bold">Storage Used:</span>
            <progress
                class="progress w-56"
                [value]="percentageConsumption"
                [ngClass]="{
                    'progress-success': percentageConsumption <= 50,
                    'progress-warning':
                        percentageConsumption > 50 &&
                        percentageConsumption < 90,
                    'progress-error': percentageConsumption >= 90,
                }"
                max="100"
            ></progress>
        </div>
    `,
})
export class StorageMeter implements OnInit, OnDestroy {
    currentConsumption = 0;
    currentConsumptionInFormat = this._storageService.formatBytes(
        this.currentConsumption
    );
    maxBucketConsumptionInFormat = this._storageService.maxBucketSizeInFormat;
    percentageConsumption = 0;
    subs: Subscription;

    private destroy$ = new Subject<void>();

    constructor(private _storageService: StorageService) {}

    ngOnInit(): void {
        this._storageService.storageState$
            .pipe(takeUntil(this.destroy$))
            .subscribe((state) => {
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
        if (this.subs) this.subs.unsubscribe();
    }
}
