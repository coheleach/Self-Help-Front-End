import { Directive, HostListener, Renderer2, ElementRef, HostBinding, OnInit } from '@angular/core';

@Directive({
    selector: '[card-body-toggle]'
})
export class CardBodyToggleDirective implements OnInit {

    private isVisible: boolean = true;
    private bodyRef: ElementRef

    constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

    ngOnInit() {
        this.bodyRef = this.elementRef.nativeElement.querySelector('.card-body');
    }

    @HostListener('click') onClick() {
        if(this.isVisible) {
            this.renderer.addClass(this.bodyRef, 'collapse');
        } else {
            this.renderer.removeClass(this.bodyRef, 'collapse');
        }
        this.isVisible = !this.isVisible;
    }

}