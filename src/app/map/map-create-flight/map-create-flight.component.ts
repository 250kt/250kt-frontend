import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AircraftService} from "../../service/aircraft.service";
import {Aircraft} from "../../shared/model/aircraft";
import {RouterService} from "../../service/router.service";
import {map} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Flight} from "../../shared/model/flight";
import {FlightService} from "../../service/flight.service";
import {AirfieldService} from "../../service/airfield.service";
import {Airfield} from "../../shared/model/airfield";
import {SnackbarService} from "../../service/snackbar.service";
import {SnackbarTiming} from "../../shared/model/snackbarTiming";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'map-create-flight',
    templateUrl: './map-create-flight.component.html',
    animations: [
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
export class MapCreateFlightComponent implements OnInit{

    constructor(
        private readonly aircraftService: AircraftService,
        private readonly routerService: RouterService,
        private readonly flightService: FlightService,
        private readonly airfieldService: AirfieldService,
        private readonly snackbarService: SnackbarService,
        private readonly translateService: TranslateService,
    ) {}

    @Input() currentFlight?: Flight;

    @Output() loadCurrentFlightEvent = new EventEmitter<Flight>();

    @ViewChild('departureAirfieldSearchInput') departureAirfieldSearchInput!: ElementRef;
    @ViewChild('arrivalAirfieldSearchInput') arrivalAirfieldSearchInput!: ElementRef;
    @ViewChild('aircraftSearchInput') aircraftSearchInput!: ElementRef;

    aircrafts: Aircraft[] = [];
    filteredAircrafts: Aircraft[] = [];
    airfields: Airfield[] = [];
    filteredAirfields: Airfield[] = [];

    selectedAircraft?: Aircraft;
    selectedDepartureAirfield?: Airfield;
    selectedArrivalAirfield?: Airfield;

    isAircraftChoiceOpen: boolean = false;
    isDepartureAirfieldChoiceOpen: boolean = false;
    isArrivalAirfieldChoiceOpen: boolean = false;
    isAircraftsLoaded: boolean = false;

    searchTermAircraft: string = '';
    searchTermAirfield: string = '';

    ngOnInit(): void {
        this.aircraftService.retrieveUserAircrafts().pipe(
            map(aircrafts => {
                this.aircrafts = aircrafts;
                this.filteredAircrafts = aircrafts;
                this.isAircraftsLoaded = true;
                return this.aircrafts.find(aircraft => aircraft.favorite);
            })
        ).subscribe(
            favoriteAircraft => {
                this.selectedAircraft = favoriteAircraft;
            }
        );
        this.airfieldService.retrieveAllAirfieldsAcceptVfr().subscribe(
            airfields => {
                this.airfields = airfields;
                this.filteredAirfields = airfields;
            }
        )
        this.loadCurrentFlight()
    }

    createNewFlight() {
        if(this.currentFlight){
            this.flightService.archiveFlight(this.currentFlight).subscribe(
                {
                    next: () => {
                        this.snackbarService.openSnackBar(this.translateService.instant('create-flight.archive-current-and-create-new.success'), this.translateService.instant('general.close'), SnackbarTiming.SHORT);
                    },
                    error: (error) => {
                        this.snackbarService.openSnackBar(this.translateService.instant('create-flight.archive-current-and-create-new.error'), this.translateService.instant('general.close'), SnackbarTiming.SHORT);
                    }
                }
            );
        }
        let flight: Flight = {
            createdAt: new Date().toISOString(),
            aircraft: this.selectedAircraft,
        }
        this.flightService.createFlight(flight).subscribe(
            flight => {
                this.currentFlight = flight;
                this.loadCurrentFlight()
            }
        );
    }

    loadCurrentFlight(){
        this.selectedDepartureAirfield = this.currentFlight?.airfieldDeparture;
        this.selectedArrivalAirfield = this.currentFlight?.airfieldArrival;
        this.loadCurrentFlightEvent.emit(this.currentFlight);
    }

    redirectProfile() {
        this.routerService.navigateTo('profile')
    }

    toggleAircraftChoice() {
        this.isAircraftChoiceOpen = !this.isAircraftChoiceOpen;
        this.searchTermAircraft = '';
        this.filteredAircrafts = this.aircrafts;
        if (this.isAircraftChoiceOpen) {
            setTimeout(() => {
                this.aircraftSearchInput.nativeElement.focus();
            }, 0);
        }
    }

    selectAircraft(aircraft: Aircraft) {
        this.selectedAircraft = aircraft;
        this.toggleAircraftChoice();
        this.currentFlight!.aircraft = aircraft;
        this.flightService.updateFlight(this.currentFlight!).subscribe(
            flight => {
                this.currentFlight = flight;
                this.loadCurrentFlight()
            }
        );
    }

    filterAircrafts() {
        this.filteredAircrafts = this.aircrafts.filter(aircraft =>
            aircraft.registration.toLowerCase().includes(this.searchTermAircraft.toLowerCase()) ||
            aircraft.model.toLowerCase().includes(this.searchTermAircraft.toLowerCase())
        );
    }

    toggleDepartureAirfieldChoice() {
        this.isDepartureAirfieldChoiceOpen = !this.isDepartureAirfieldChoiceOpen;
        this.searchTermAirfield = '';
        this.filteredAirfields = this.airfields;
        if (this.isDepartureAirfieldChoiceOpen) {
            setTimeout(() => {
                this.departureAirfieldSearchInput.nativeElement.focus();
            }, 0);
        }
    }

    toggleArrivalAirfieldChoice() {
        this.isArrivalAirfieldChoiceOpen = !this.isArrivalAirfieldChoiceOpen;
        this.searchTermAirfield = '';
        this.filteredAirfields = this.airfields;
        if (this.isArrivalAirfieldChoiceOpen) {
            setTimeout(() => {
                this.arrivalAirfieldSearchInput.nativeElement.focus();
            }, 0);
        }
    }

    selectDepartureAirfield(airfield: Airfield) {
        this.selectedDepartureAirfield = airfield;
        this.toggleDepartureAirfieldChoice();
        this.currentFlight!.airfieldDeparture = airfield;
        this.flightService.updateFlight(this.currentFlight!).subscribe(
            flight => {
                this.currentFlight = flight;
                this.loadCurrentFlight()
            }
        );
    }

    selectArrivalAirfield(airfield: Airfield) {
        this.selectedArrivalAirfield = airfield;
        this.toggleArrivalAirfieldChoice();
        this.currentFlight!.airfieldArrival = airfield;
        this.flightService.updateFlight(this.currentFlight!).subscribe(
            flight => {
                this.currentFlight = flight;
                this.loadCurrentFlight()
            }
        );
    }

    filterAirfields() {
        this.filteredAirfields = this.airfields.filter(airfield =>
            "LF".concat(airfield.code).toLowerCase().includes(this.searchTermAirfield.toLowerCase()) ||
            airfield.fullName.toLowerCase().includes(this.searchTermAirfield.toLowerCase())
        );
    }
}
