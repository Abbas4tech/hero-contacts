import { FullMetadata } from '@angular/fire/storage';

export interface StorageFile extends FullMetadata {
    url: string;
}
