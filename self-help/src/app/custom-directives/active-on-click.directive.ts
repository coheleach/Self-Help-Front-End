import { Directive, Renderer2, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[active-on-click]'
})
export class ActiveOnClickDirective {

  activated: boolean = false;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  @HostListener('click') onClick() {
    this.activated = !this.activated;
    if(this.activated) {
      this.renderer.addClass(this.elementRef.nativeElement, 'active');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'active');
    }
  }

}
