import { FullMetadata } from '@angular/fire/storage';

export interface StorageFile extends FullMetadata {
    url: string;
}

export interface DetailedFileData {
    meta: FullMetadata;
    downloadUrl: string;
    file: Blob;
}
