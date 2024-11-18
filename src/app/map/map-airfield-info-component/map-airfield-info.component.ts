import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Airfield} from "../../shared/model/airfield";
import {Subscription} from "rxjs";
import {WeatherService} from "../../service/weather.service";
import { AirfieldWeather } from 'src/app/shared/model/weather';
import {environment} from "../../../environments/environment";

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
        ]),
        trigger('slideInOut', [
            state('void', style({ opacity: 0 })),
            transition(':enter', [
                animate('200ms ease-in')
            ]),
            transition(':leave', [
                animate('200ms ease-out')
            ])
        ])
    ]
})
export class MapAirfieldInfoComponent implements OnDestroy{

    constructor(
        private cdr: ChangeDetectorRef,
        private weatherService: WeatherService,
    ) {}

    ngOnDestroy(): void {
        this.subscription.forEach(sub => sub.unsubscribe());
    }

    @Input() airfield?: Airfield;
    @Output() closeEvent = new EventEmitter<void>();
    @Output() selectDepartureEvent = new EventEmitter<Airfield>();
    @Output() selectArrivalEvent = new EventEmitter<Airfield>();

    airfieldWeather?: AirfieldWeather;

    isShowWeather = false;

    subscription: Subscription[] = [];

    close() {
        this.airfield = undefined;
        this.cdr.detectChanges();
        this.closeEvent.emit();
    }

    openPdf(code: string) {
        const pdfUrl = environment.pdfUrl + '/AD/AD-2.LF' + code + '.pdf';
        window.open(pdfUrl, '_blank');
    }

    selectAirfieldDeparture() {
        this.selectDepartureEvent.emit(this.airfield);
    }

    selectAirfieldArrival() {
        this.selectArrivalEvent.emit(this.airfield);
    }

    getWeather(airfieldCode: string) {
        const sub = this.weatherService.getAirfieldWeather(airfieldCode).subscribe(
            res => {
                this.airfieldWeather = res;
                this.isShowWeather = true;
                this.cdr.detectChanges();
            }
        );
        this.subscription.push(sub);
    }

    toggleShowwWeather() {
        this.isShowWeather = !this.isShowWeather;
        this.cdr.detectChanges();
    }
}
