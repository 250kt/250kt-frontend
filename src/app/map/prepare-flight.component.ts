import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild} from '@angular/core';
import {ObstacleService} from '../service/obstacle.service';
import {getIconObstacle, Obstacle} from "../shared/model/obstacle";
import {UserService} from "../service/user.service";
import {Airfield, AirfieldShort, AirfieldType, getIconAirfield} from '../shared/model/airfield';
import {AirfieldService} from "../service/airfield.service";
import {FlightService} from "../service/flight.service";
import {Flight} from "../shared/model/flight";
import {Observable, Subscription} from "rxjs";
import {Aircraft} from "../shared/model/aircraft";
import {AircraftService} from "../service/aircraft.service";
import {RouterService} from "../service/router.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {take} from "rxjs/operators";
import {Step} from "../shared/model/step";
import LatLngLiteral = google.maps.LatLngLiteral;
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
    selector: 'prepare-flight',
    templateUrl: './prepare-flight.component.html',
    animations: [
        trigger('slideInOut', [
            state('void', style({ opacity: 0 })),
            transition(':enter', [
                animate('200ms ease-in')
            ]),
            transition(':leave', [
                animate('200ms ease-out')
            ])
        ]),
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
export class PrepareFlightComponent implements OnInit, OnDestroy{

    constructor(
        private readonly obstacleService: ObstacleService,
        private readonly userService: UserService,
        private readonly airfieldService: AirfieldService,
        private cdr: ChangeDetectorRef,
        private readonly flightService: FlightService,
        private readonly aircraftService: AircraftService,
        private readonly routerService: RouterService,
    ) {}

    @ViewChild('departureAirfieldSearchInput') departureAirfieldSearchInput!: ElementRef;
    @ViewChild('arrivalAirfieldSearchInput') arrivalAirfieldSearchInput!: ElementRef;
    @ViewChild('aircraftSearchInput') aircraftSearchInput!: ElementRef;
    @ViewChild('stepsAirfieldSearchInput') stepsAirfieldSearchInput!: QueryList<ElementRef>

    options: google.maps.MapOptions = {
        zoom: 10,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        disableDefaultUI: true,
        fullscreenControl: false,
        headingInteractionEnabled: false,
        keyboardShortcuts: false,
        mapTypeControl: false,
        rotateControl: false,
        scaleControl: false,
        clickableIcons: false,
        streetViewControl: false,
        tiltInteractionEnabled: false,
        zoomControl: true,
    };
    markersObstacles: google.maps.Marker[] = [];
    markersAirfields: google.maps.Marker[] = [];

    flightPath?: google.maps.Polyline;
    markerDepartureAirfield?: google.maps.Marker;
    markerArrivalAirfield?: google.maps.Marker;
    markersSteps?: google.maps.Marker[] = [];
    map?: google.maps.Map;

    isLoading: boolean = true;
    isObstacleShown = true;

    isMapLoaded = false;

    isAircraftChoiceOpen: boolean = false;
    isDepartureAirfieldChoiceOpen: boolean = false;
    isArrivalAirfieldChoiceOpen: boolean = false;
    isShowFlightList: boolean = false;
    isStepChoiceOpen: boolean[] = [];

    searchTermAircraft: string = '';
    searchTermAirfield: string = '';

    aircrafts: Observable<Aircraft[]> = new Observable<Aircraft[]>();
    filteredAircrafts: Aircraft[] = [];
    resetFilteredAircrafts: Aircraft[] = [];

    airfields: Observable<Airfield[]> = new Observable<Airfield[]>();
    filteredAirfields: Airfield[] = [];
    resetFilteredAirfields: Airfield[] = [];

    flights: Observable<Flight[]> = new Observable<Flight[]>();

    selectedAirfield?: Airfield;
    currentFlight?: Flight;
    subscription: Subscription[] = [];

    ngOnInit() {
        this.getUserAircrafts();
        this.getAirfields();
        this.getFlights();
        this.loadCurrentFlight()
    }

    ngOnDestroy(): void {
        this.subscription.forEach(sub => sub.unsubscribe());
    }

    getUserAircrafts() {
        this.aircrafts = this.aircraftService.retrieveUserAircrafts();
        this.aircrafts.forEach(aircrafts => {
            this.filteredAircrafts = aircrafts;
            this.resetFilteredAircrafts = aircrafts;
        })
    }

    getAirfields() {
        this.airfields = this.airfieldService.retrieveAllAirfieldsAcceptVfr();
        this.airfields.forEach(airfields => {
            this.filteredAirfields = airfields;
            this.resetFilteredAirfields = airfields;
        })
    }

    getFlights() {
        this.flights = this.flightService.getUserFlights()
    }

    loadCurrentFlight() {
        const subscription = this.flightService.getCurrentUserFlight().pipe(take(1000)).subscribe(
            (flight: Flight) => {
                this.currentFlight = flight;
                this.isLoading = false;
                if(flight){
                    this.initStepChoiceOpen(this.currentFlight.steps!.length);
                    this.drawLineBetweenAirfields();
                }
            },

        );
        if(subscription) {
            this.subscription.push(subscription);
        }
    }

    handleMapLoad(map: google.maps.Map) {
        this.map = map;
        this.isMapLoaded = true;
        this.userService.retrieveFavoriteAirfield().subscribe((airfield: AirfieldShort) => {
            map.setCenter({lat: airfield.latitude, lng: airfield.longitude});
        });

        this.airfieldService.retrieveAllAirfields().subscribe((airfields: Airfield[]) => {
            this.markersAirfields = airfields.map((airfield: Airfield) => {
                const marker = new google.maps.Marker({
                    position: {lat: airfield.latitude, lng: airfield.longitude},
                    title: airfield.fullName,
                    icon: {
                        url: getIconAirfield(airfield.type),
                        scaledSize: new google.maps.Size(35, 35),
                        anchor: new google.maps.Point(17.5, 17.5),
                    },
                });
                if(airfield.type === AirfieldType.CIVIL_PAVED || airfield.type === AirfieldType.CIVIL_UNPAVED){
                    marker.addListener('click', () => this.handleAirfieldClick(airfield));
                }
                return marker;

            });
            this.updateMarkersAirfields(map);
        });

        this.obstacleService.retrieveObstacles().subscribe((obstacles: Obstacle[]) => {
            this.markersObstacles = obstacles.map((obstacle: Obstacle) => {
                return new google.maps.Marker({
                    position: {lat: obstacle.latitude, lng: obstacle.longitude},
                    title: obstacle.id + ' ' + obstacle.type,
                    icon: {
                        url: getIconObstacle(obstacle.type),
                        scaledSize: new google.maps.Size(25, 35),
                    },
                });
            });

            this.updateMarkersObstacles(map);
        });

        map.addListener('bounds_changed', () => {
            this.updateMarkersObstacles(map);
            this.updateMarkersAirfields(map);
        });

    }

    updateMarkersAirfields(map: google.maps.Map) {
        const zoom = map.getZoom();
        const bounds = map.getBounds();

        if(zoom && zoom < 6){
            this.markersAirfields.forEach(marker => {
                marker.setMap(null);
            });
        }else{
            if(bounds){
                this.markersAirfields.forEach(marker => {
                    if (bounds.contains(marker.getPosition()!)) {
                        marker.setMap(map);
                    } else {
                        marker.setMap(null);
                    }
                });
            }
        }
    }

    updateMarkersObstacles(map: google.maps.Map) {
        const bounds = map.getBounds();
        const zoom = map.getZoom();

        this.markersObstacles.forEach(marker => {
            if (this.isObstacleShown && zoom && zoom >= 10 && bounds && bounds.contains(marker.getPosition()!)) {
                marker.setMap(map);
            } else {
                marker.setMap(null);
            }
        });
    }

    toggleObstacleVisibility() {
        this.isObstacleShown = !this.isObstacleShown;
        this.updateMarkersObstacles(this.map!);
    }

    handleAirfieldClick(airfield: Airfield) {
        if (this.selectedAirfield === airfield) {
            this.selectedAirfield = undefined;
        } else {
            this.selectedAirfield = airfield;
        }
        this.cdr.detectChanges();
    }

    closeAirfieldInfo() {
        this.selectedAirfield = undefined;
        this.cdr.detectChanges();
    }

    drawLineBetweenAirfields() {
        setTimeout(() => {
            this.flightPath?.setMap(null);

            let path: LatLngLiteral[] = [];

            this.currentFlight?.steps?.forEach(step => {
                path.push({lat: step.airfield.latitude, lng: step.airfield.longitude});
            });

            this.flightPath = new google.maps.Polyline({
                map: this.map,
                path: path,
                geodesic: false,
                strokeColor: '#eab308',
                strokeOpacity: 1.0,
                strokeWeight: 6
            });
            const midpoint = this.computeMidpoint(this.currentFlight?.steps!);
            this.centerMapOnCurrentFlight(midpoint, this.currentFlight?.steps!);
            this.addAirfieldsMarker(this.currentFlight?.steps);
        }, 1000);

    }

    addAirfieldsMarker(steps: Step[] | undefined) {
        this.markerDepartureAirfield?.setMap(null);
        this.markerArrivalAirfield?.setMap(null);
        this.markersSteps?.forEach(marker => marker.setMap(null));
        this.markersSteps = [];

        if(steps?.at(0)!.airfield.code === steps?.at(steps?.length-1)!.airfield.code && steps!.length === 0){
            return;
        }

        this.markerDepartureAirfield = new google.maps.Marker({
            position: {lat: steps!.at(0)!.airfield.latitude, lng: steps!.at(0)!.airfield.longitude},
            icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 5,
                fillColor: '#22c55e',
                fillOpacity: 1,
                strokeColor: '#22c55e',
                strokeOpacity: 1,
                strokeWeight: 1,
                rotation: -23,
            },
            zIndex: 10,
            clickable: false,
        });
        this.markerDepartureAirfield.setMap(this.map!);

        steps!.forEach(step => {
            if(steps != steps!.at(0) && steps != steps!.at(steps!.length-1)){
                const marker = new google.maps.Marker({
                    position: {lat: step.airfield.latitude, lng: step.airfield.longitude},
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 5,
                        fillColor: '#6b7280',
                        fillOpacity: 1,
                        strokeColor: '#6b7280',
                        strokeOpacity: 1,
                        strokeWeight: 1,
                    },
                    zIndex: 10,
                    clickable: false,
                });
                this.markersSteps?.push(marker);
            }
        });
        this.markersSteps?.forEach(marker => marker.setMap(this.map!));

        this.markerArrivalAirfield = new google.maps.Marker({
            position: {lat: steps!.at(steps!.length-1)!.airfield.latitude, lng: steps!.at(steps!.length-1)!.airfield.longitude},
            icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 5,
                fillColor: '#ef4444',
                fillOpacity: 1,
                strokeColor: '#ef4444',
                strokeOpacity: 1,
                strokeWeight: 1,
                rotation: 23,
            },
            zIndex: 10,
            clickable: false,
        });
        this.markerArrivalAirfield.setMap(this.map!);


    }

    computeMidpoint(steps: Step[]){
        let latSum = 0;
        let lngSum = 0;
        steps.forEach(step => {
            latSum += step.airfield.latitude;
            lngSum += step.airfield.longitude;
        });

        return {lat: latSum/steps.length, lng: lngSum/steps.length};
    }

    centerMapOnCurrentFlight(midpoint: {lat: number, lng: number}, steps: Step[]){
        if(steps.at(0)!.airfield.code === steps.at(steps.length-1)?.airfield.code && steps.length === 2){
            this.map!.setZoom(10);
            this.map!.setCenter({lat: steps.at(0)!.airfield.latitude, lng: steps.at(steps.length-1)!.airfield.longitude});
        }else{

            this.map!.setCenter(midpoint);

            const bounds = new google.maps.LatLngBounds();

            steps.forEach(step => {
                bounds.extend({lat: step.airfield.latitude, lng: step.airfield.longitude});
            });

            this.map!.fitBounds(bounds);
        }
    }

    redirectProfile() {
        this.routerService.navigateTo('profile')
    }

    toggleShowFlightList() {
        this.isShowFlightList = !this.isShowFlightList;
    }


    toggleAircraftChoice() {
        this.isAircraftChoiceOpen = !this.isAircraftChoiceOpen;
        this.searchTermAircraft = '';
        if (this.isAircraftChoiceOpen) {
            setTimeout(() => {
                this.aircraftSearchInput.nativeElement.focus();
            }, 0);
        }
    }

    toggleDepartureAirfieldChoice() {
        this.isDepartureAirfieldChoiceOpen = !this.isDepartureAirfieldChoiceOpen;
        this.searchTermAirfield = '';
        if (this.isDepartureAirfieldChoiceOpen) {
            setTimeout(() => {
                this.departureAirfieldSearchInput.nativeElement.focus();
                this.cdr.detectChanges();
            }, 0);
        }
    }

    toggleArrivalAirfieldChoice() {
        this.isArrivalAirfieldChoiceOpen = !this.isArrivalAirfieldChoiceOpen;
        this.searchTermAirfield = '';
        if (this.isArrivalAirfieldChoiceOpen) {
            setTimeout(() => {
                this.arrivalAirfieldSearchInput.nativeElement.focus();
            }, 0);
        }
    }

    selectAircraft(aircraft: Aircraft) {
        this.toggleAircraftChoice();
        const sub = this.flightService.changeAircraft(aircraft).subscribe(
            (flight: Flight) => {
                this.currentFlight = flight;
            }
        )
        if(sub){
            this.subscription.push(sub);
        }
    }

    selectDepartureAirfield(airfield: Airfield, toogleSelect: boolean) {
        if(toogleSelect){
            this.toggleDepartureAirfieldChoice();
        }
        const sub = this.flightService.changeDepartureAirfield(airfield).subscribe(
            (flight: Flight) => {
                this.currentFlight = flight;
                this.drawLineBetweenAirfields();
                this.cdr.detectChanges();
            }
        )
        if(sub){
            this.subscription.push(sub);
        }
    }

    selectArrivalAirfield(airfield: Airfield, toogleSelect: boolean) {
        if(toogleSelect){
            this.toggleArrivalAirfieldChoice();
        }
        const sub = this.flightService.changeArrivalAirfield(airfield).subscribe(
            (flight: Flight) => {
                this.currentFlight = flight;
                this.drawLineBetweenAirfields();
                this.cdr.detectChanges();
            }
        )
        if(sub){
            this.subscription.push(sub);
        }
    }

    loadFlight(flight: Flight) {
        const sub = this.flightService.changeCurrentFlight(flight).subscribe(
            (flight: Flight) => {
                this.currentFlight = flight;
                this.drawLineBetweenAirfields();
            }
        );
        if (sub) {
            this.subscription.push(sub);
        }

        this.toggleShowFlightList();
        this.drawLineBetweenAirfields();
    }

    filterAirfields() {
        this.filteredAirfields = this.resetFilteredAirfields.filter(airfield =>
            "LF".concat(airfield.code).toLowerCase().includes(this.searchTermAirfield.toLowerCase()) ||
            airfield.fullName.toLowerCase().includes(this.searchTermAirfield.toLowerCase())
        );
    }

    filterAircrafts() {
        this.filteredAircrafts = this.resetFilteredAircrafts.filter(aircraft =>
            aircraft.registration.toLowerCase().includes(this.searchTermAircraft.toLowerCase()) ||
            aircraft.model.toLowerCase().includes(this.searchTermAircraft.toLowerCase())
        );
    }

    createNewFlight() {
        const subscribe = this.flightService.createFlight().subscribe(
            (flight: Flight) => {
                this.currentFlight = flight;
                this.drawLineBetweenAirfields();
            }
        );
        if(subscribe){
            this.subscription.push(subscribe);
        }
    }

    addStep() {
        const subscribe = this.flightService.addStep().subscribe(
            (flight: Flight) => {
                this.currentFlight = flight;
                this.initStepChoiceOpen(this.currentFlight.steps!.length);
                this.drawLineBetweenAirfields();
            }
        );
        if(subscribe){
            this.subscription.push(subscribe);
        }
    }

    resetStepChoiceOpen(order: number) {
        this.isStepChoiceOpen.forEach((value, index) => {
            if(index !== order){
                this.isStepChoiceOpen[index] = false;
            }
        });
        this.cdr.detectChanges();
    }

    toggleStepChoice(step: Step) {
        this.isStepChoiceOpen[step.order-1] = !this.isStepChoiceOpen[step.order-1];
        this.resetStepChoiceOpen(step.order-1);
        this.searchTermAirfield = '';
        this.filteredAirfields = this.resetFilteredAirfields;

        if (this.isStepChoiceOpen[step.order-1]) {
            setTimeout(() => {
                document.getElementById('step-'+step.order)!.focus()
                this.cdr.detectChanges();
            }, 0);
        }

    }

    selectStepAirfield(step: Step, airfield: Airfield, b: boolean) {
        if(b){
            this.toggleStepChoice(step);
        }
        const sub = this.flightService.changeStepAirfield(step, airfield).subscribe(
            (flight: Flight) => {
                this.currentFlight = flight;
                this.drawLineBetweenAirfields();
                this.cdr.detectChanges();
            }
        );
        if(sub){
            this.subscription.push(sub);
        }
    }

    private initStepChoiceOpen(length: number) {
        for (let i = 0; i < length; i++) {
            this.isStepChoiceOpen.push(false);
        }
    }

    removeStep(step: Step) {
        const sub = this.flightService.removeStep(step).subscribe(
            (flight: Flight) => {
                this.currentFlight = flight;
                this.initStepChoiceOpen(this.currentFlight.steps!.length);
                this.drawLineBetweenAirfields();
            }
        );
        if(sub){
            this.subscription.push(sub);
        }
    }

    drop(event: CdkDragDrop<Step[]>) {
        moveItemInArray(this.currentFlight?.steps!, event.previousIndex, event.currentIndex);
        this.updateStepOrder(event.previousIndex, event.currentIndex);
    }

    updateStepOrder(previousOrder: number, currentOrder: number) {
        const sub = this.flightService.changeStepOrder(previousOrder, currentOrder, this.currentFlight!.id!).subscribe(
            (flight: Flight) => {
                this.currentFlight = flight;
                this.drawLineBetweenAirfields();
            }
        );
        if(sub){
            this.subscription.push(sub);
        }

    }

}
