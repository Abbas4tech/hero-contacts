import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'message',
    templateUrl: './message.component.html',
})
export class MessageComponent {
    @Output() onClick: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() message: string;
    constructor() {}
    onDelete(): void {
        this.onClick.emit(true);
    }
}
