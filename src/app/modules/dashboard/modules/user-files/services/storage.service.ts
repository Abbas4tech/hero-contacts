import { inject, Injectable } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ToastService } from 'src/app/services/toaster.service';
import {
    deleteObject,
    FirebaseStorage,
    getDownloadURL,
    getMetadata,
    listAll,
    ref,
    StorageReference,
    uploadBytesResumable,
    UploadTask,
    Storage,
    getBlob,
} from '@angular/fire/storage';
import { StorageFile, Upload } from '../model/types';
import { BehaviorSubject, Subscription } from 'rxjs';

interface StorageState {
    files: StorageFile[];
    totalConsumption: number;
}

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private storage: FirebaseStorage = inject(Storage);
    private storageState = new BehaviorSubject<StorageState>(null);
    private subscriptions: Subscription[] = [];

    private selectedFiles!: FileList;
    basePath!: string;
    readonly maxBucketSizeInBytes = 104857600; // 100MB

    currentUpload: BehaviorSubject<Upload> = new BehaviorSubject<Upload>(null);

    constructor(
        private _toastr: ToastService,
        private _auth: AuthService
    ) {
        this.subscriptions.push(
            this._auth.user.subscribe((user) => {
                if (user) {
                    this.basePath = user.email;
                    this.loadStorageFiles(); // Load files for new user
                } else {
                    this.basePath = null;
                    this.storageState.next({ files: [], totalConsumption: 0 }); // Reset state on logout
                }
            })
        );
    }

    get storageState$() {
        return this.storageState.asObservable();
    }

    async loadStorageFiles(): Promise<void> {
        try {
            const reference = ref(this.storage, this.basePath);
            const list = await listAll(reference);
            const files = await Promise.all(
                list.items.map(this.mapToStorageFile)
            );

            const totalConsumption = files.reduce(
                (sum, file) => sum + file.size,
                0
            );
            this.storageState.next({ files, totalConsumption });
        } catch (error) {
            console.error(error);
            this._toastr.error(`Error loading files: ${error.message}`);
        }
    }

    private async mapToStorageFile(
        item: StorageReference
    ): Promise<StorageFile> {
        const metadata = await getMetadata(item);
        const url = await getDownloadURL(item);
        const blob = await getBlob(item);
        return {
            ...metadata,
            timeCreated: new Date(metadata.timeCreated).toLocaleString(
                'en-US',
                {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: true,
                }
            ),
            url,
            blob,
        };
    }

    detectFiles(fileList: FileList): void {
        this.selectedFiles = fileList;
    }

    formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const index = Math.floor(Math.log(bytes) / Math.log(1024));
        const formattedSize = (bytes / Math.pow(1024, index)).toFixed(2);

        return `${formattedSize} ${units[index]}`;
    }

    get maxBucketSizeInFormat(): string {
        return this.formatBytes(this.maxBucketSizeInBytes);
    }

    checkIfBucketHasStorageCapacity(sizeToUplaod: number) {
        const currentConsumption =
            this.storageState.getValue().totalConsumption;
        const availableSize = this.maxBucketSizeInBytes - currentConsumption;
        return availableSize >= sizeToUplaod;
    }

    uploadSingleFile(): void {
        const file = this.selectedFiles?.item(0);
        if (file) {
            const haveEnoughStorage = this.checkIfBucketHasStorageCapacity(
                file.size
            );
            if (!haveEnoughStorage) {
                this._toastr.error(
                    'You dont have enough storage to save this file!'
                );
                return;
            }
            this.pushUpload(file);
        } else {
            this._toastr.warning('No file selected for upload.');
        }
    }

    private pushUpload(upload: File): void {
        const fileRef = ref(this.storage, `${this.basePath}/${upload.name}`);
        const uploadTask = uploadBytesResumable(fileRef, upload);
        this.currentUpload.next({
            ...this.currentUpload.getValue(),
            $key: upload.name,
            createdAt: new Date(),
            file: upload,
            name: upload.name,
            url: fileRef.fullPath,
        });
        this.handleUploadState(uploadTask);
    }

    private handleUploadState(uploadTask: UploadTask) {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                this.currentUpload.next({
                    ...this.currentUpload.getValue(),
                    progress: Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    ),
                });
            },
            (error) => {
                console.error('Upload failed:', error);
                this._toastr.error(error.message);
            },
            async () => {
                this.currentUpload.next({
                    ...this.currentUpload.getValue(),
                    url: await getDownloadURL(uploadTask.snapshot.ref),
                });
                await this.loadStorageFiles();
                this._toastr.success(
                    `Successfully uploaded ${this.currentUpload.getValue().name}!`
                );
                this.currentUpload.next(null);
            }
        );
    }

    async deleteFile(path: string) {
        const storageRef = ref(this.storage, path);
        try {
            await deleteObject(storageRef);
            this._toastr.success(`Deleted ${storageRef.name} Successfully!`);
        } catch (error) {
            console.error(error);
            this._toastr.error(`Failed to delete ${storageRef.name}`);
        } finally {
            await this.loadStorageFiles();
        }
    }
}
