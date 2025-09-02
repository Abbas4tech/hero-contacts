import {
    Component,
    OnDestroy,
    ViewChild,
    ElementRef,
    OnInit,
    TemplateRef,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import { StorageService } from '../services/storage.service';
import { StorageFile, Upload } from '../model/types';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'hero-drive',
    templateUrl: './index.screen.html',
    standalone: false,
})
export class UserFilesScreen implements OnInit, OnDestroy, AfterViewInit {
    files: StorageFile[] = [];
    private destroy$ = new Subject<void>();
    @ViewChild('fileInput') fileElement!: ElementRef<HTMLInputElement>;
    @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;
    @ViewChild('uploadTemplate')
    uploadTemplate!: TemplateRef<HTMLElement[]>;
    currentUpload!: Upload;
    constructor(
        private _uploadService: StorageService,
        private _common: CommonService,
        private _route: ActivatedRoute,
        private _changeRef: ChangeDetectorRef
    ) {}

    detectFiles(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target?.files) {
            this._uploadService.detectFiles(target.files);
            this._uploadService.uploadSingleFile();
        }
    }

    ngOnInit(): void {
        this._common.setTitle('Files');
        const data = this._route.snapshot.data['allFiles'];
        console.log(data);
        this._uploadService.currentUpload
            .pipe(takeUntil(this.destroy$))
            .subscribe((val) => {
                if (!val) return;
                this.currentUpload = val;
                if (val) this.dialog.nativeElement.showModal();
                this._changeRef.detectChanges();
            });
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this._common.updateTemplate(this.uploadTemplate);
        });
    }

    uploadSingleFile(): void {
        this._uploadService.uploadSingleFile();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this._common.updateTemplate(null);
    }

    trackByFileName(index: number, file: StorageFile): string {
        return file.name;
    }
}
