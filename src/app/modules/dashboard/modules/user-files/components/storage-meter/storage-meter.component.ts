import { Component, Input, OnInit } from '@angular/core';
import { StorageFile } from '../../model/types';

@Component({
    selector: 'storage-meter',
    template: ` <div
        class="radial-progress text-warning"
        style="--value: 70"
        role="progressbar"
    >
        {{ totalConsumption }} of 100 MB
    </div>`,
})
export class StorageMeter implements OnInit {
    @Input() files: StorageFile[];
    currentConsumption: number;
    totalConsumption = '0 Bytes';

    private formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const kB = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(kB));
        const formattedSize = parseFloat((bytes / Math.pow(kB, i)).toFixed(2));

        return `${formattedSize} ${sizes[i]}`;
    }

    constructor() {}
    ngOnInit(): void {
        this.totalConsumption = this.formatBytes(
            this.files.reduce((a, b) => a + b.size, 0)
        );
    }
}
