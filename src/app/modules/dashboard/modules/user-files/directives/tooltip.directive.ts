import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[data-tip]',
})
export class TooltipDirective {
    @Input('data-tip') tooltipText: string;

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnInit() {
        console.log(this.el.nativeElement);
        if (this.tooltipText) {
            this.renderer.setAttribute(
                this.el.nativeElement,
                'data-tip',
                this.tooltipText
            );
        }
    }
}
