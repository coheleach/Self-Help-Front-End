import { Directive, HostListener, Renderer2, ElementRef, HostBinding, OnInit } from '@angular/core';

@Directive({
    selector: '[card-title-toggle]'
})
export class CardTitleToggleDirective implements OnInit {

    private isVisible: boolean = true;
    private bodyRef: ElementRef

    constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

    ngOnInit() {
        this.bodyRef = this.elementRef.nativeElement.nextSibling;
    }

    @HostListener('click') onClick() {
        if(this.isVisible) {
            this.renderer.removeClass(this.bodyRef, 'collapse');
            this.renderer.addClass(this.bodyRef, 'collapse.show')
        } else {
            this.renderer.removeClass(this.bodyRef, 'collapse.show');
            this.renderer.addClass(this.bodyRef, 'collapse');
        }
        this.isVisible = !this.isVisible;
    }

}