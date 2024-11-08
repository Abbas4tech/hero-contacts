import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'dynamic-modal',
    templateUrl: './modal.component.html',
})
export class Modal implements OnInit, AfterViewInit {
    @Input() title: string;
    @Input('id') id: string;
    @Input('template') template: TemplateRef<HTMLElement[]>;
    @ViewChild('dialog') dialog: ElementRef<HTMLDialogElement>;
    percentage = 0;
    constructor() {}
    ngOnInit(): void {}

    ngAfterViewInit(): void {
        console.log(this.dialog);
    }

    show() {
        console.log(this.dialog);
        this.dialog.nativeElement.showModal();
    }
}
