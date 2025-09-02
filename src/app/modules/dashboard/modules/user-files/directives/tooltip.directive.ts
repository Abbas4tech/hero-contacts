import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges,
} from '@angular/core';

@Directive({
    selector: '[data-tip]',
    standalone: false,
})
export class TooltipDirective implements OnChanges {
    @Input('data-tip') tooltipText: string = '';

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.renderer.setAttribute(
            this.el.nativeElement,
            'data-tip',
            changes['tooltipText'].currentValue
        );
    }
}
