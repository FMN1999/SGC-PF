import { Directive, ElementRef, Input, OnInit, ViewContainerRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { ConnectionPositionPair, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { AutocompleteComponent } from './autocomplete.component';
import { TemplatePortal } from '@angular/cdk/portal';
import { filter, takeUntil } from 'rxjs/operators';
import { NgControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
  standalone: false,
  selector: '[appAutocomplete]'
})
export class AutocompleteDirective implements OnInit {
  @Input() appAutocomplete!: AutocompleteComponent;
  private overlayRef!: OverlayRef | null;

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private ngControl: NgControl,
    private vcr: ViewContainerRef,
    private overlay: Overlay
  ) {
  }

  get control() {
    return this.ngControl.control;
  }

  ngOnInit() {
    fromEvent(this.origin, 'focus').pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      this.openDropdown();

      this.appAutocomplete.optionsClick()
        .pipe(takeUntil(<any>this.overlayRef?.detachments()))
        .subscribe(( value: any ) => {
          this.control?.setValue(value);
          this.close();
        });
    });
  }

  openDropdown() {
    this.overlayRef = this.overlay.create({
      width: this.origin.offsetWidth,
      maxHeight: 40 * 3,
      backdropClass: '',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy: this.getOverlayPosition()
    });

    const template = new TemplatePortal(this.appAutocomplete.rootTemplate, this.vcr);
    this.overlayRef.attach(template);

    overlayClickOutside(this.overlayRef, this.origin).subscribe(() => this.close());
    overlayEscape(this.overlayRef, this.origin).subscribe(() => this.close());
  }

  ngOnDestroy() {}

  private close() {
    this.overlayRef?.detach();
    this.overlayRef = null;
    this.origin.blur();
  }

  private getOverlayPosition() {
    const positions = [
      new ConnectionPositionPair(
        { originX: 'start', originY: 'bottom' },
        { overlayX: 'start', overlayY: 'top' }
      ),
      new ConnectionPositionPair(
        { originX: 'start', originY: 'top' },
        { overlayX: 'start', overlayY: 'bottom' }
      )
    ];

    return this.overlay
      .position()
      .flexibleConnectedTo(this.origin)
      .withPositions(positions)
      .withFlexibleDimensions(false)
      .withPush(false);
  }

  get origin() {
    return this.host.nativeElement;
  }
}

export function overlayClickOutside(overlayRef: OverlayRef, origin: HTMLElement) {
  return fromEvent<MouseEvent>(document, 'click')
    .pipe(
      filter(event => {
        const clickTarget = event.target as HTMLElement;
        const notOrigin = clickTarget !== origin; // the input
        const notOverlay = !!overlayRef && (overlayRef.overlayElement.contains(clickTarget) === false); // the autocomplete
        return notOrigin && notOverlay;
      }),
      takeUntil(overlayRef.detachments())
    )
}

export function overlayEscape(overlayRef: OverlayRef, origin: HTMLElement) {
  return fromEvent<KeyboardEvent>(document, 'keydown')
    .pipe(
      filter(event => {
        const keyPressTarget = event.target as HTMLElement;
        const isOrigin = keyPressTarget === origin; // the input
        const notOverlay = !!overlayRef && (overlayRef.overlayElement.contains(keyPressTarget) === false); // the autocomplete
        const keyIsEscape = event.key === 'Escape';
        return isOrigin && notOverlay && keyIsEscape;
      }),
      takeUntil(overlayRef.detachments())
    )
}
