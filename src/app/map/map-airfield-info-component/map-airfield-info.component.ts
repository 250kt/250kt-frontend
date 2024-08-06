import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Airfield} from "../../shared/model/airfield";

@Component({
    selector: 'map-airfield-info-component',
    templateUrl: './map-airfield-info.component.html',
    animations: [
        trigger('slideInFromBottom', [
            state('void', style({ transform: 'translateY(100%)' })),
            state('*', style({ transform: 'translateY(0)' })),
            transition(':enter', [
                animate('100ms ease-in')
            ])
        ]),
        trigger('slideOutToBottom', [
            state('*', style({ transform: 'translateY(0)' })),
            state('void', style({ transform: 'translateY(100%)' })),
            transition(':leave', [
                animate('100ms ease-out')
            ])
        ])
    ]
})
export class MapAirfieldInfoComponent {

    constructor(
        private cdr: ChangeDetectorRef,
    ) {}

    @Input() airfield?: Airfield;
    @Output() closeEvent = new EventEmitter<void>();

    close() {
        this.airfield = undefined;
        this.cdr.detectChanges();
        this.closeEvent.emit();
    }

    openPdf(code: string) {
        const pdfUrl = 'https://storage.cloud.google.com/avian-foundry-384513.appspot.com/AD/AD-2.LF' + code + '.pdf';
        window.open(pdfUrl, '_blank');
    }
}
