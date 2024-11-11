import { FullMetadata } from '@angular/fire/storage';

export interface StorageFile extends FullMetadata {
    url: string;
    blob: Blob;
}

export interface Upload {
    $key: string;
    file: File;
    name: string;
    url: string;
    progress: number;
    createdAt: Date;
}
