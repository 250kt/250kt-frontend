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
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import * as mapboxgl from "mapbox-gl";
import {environment} from "../../environments/environment";

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
        ]),
        trigger('slideInFromLeft', [
            state('void', style({ transform: 'translateX(-100%)' })),
            state('*', style({ transform: 'translateX(0)' })),
            transition(':enter', [
                animate('200ms ease-in')
            ])
        ]),
        trigger('slideOutToLeft', [
            state('*', style({ transform: 'translateX(0)' })),
            state('void', style({ transform: 'translateX(-100%)' })),
            transition(':leave', [
                animate('200ms ease-out')
            ])
        ])
    ]
})
export class PrepareFlightComponent implements OnInit, OnDestroy{

    constructor(
        private readonly obstacleService: ObstacleService,
        private readonly userService: UserService,
        private readonly airfieldService: AirfieldService,
        private readonly cdr: ChangeDetectorRef,
        private readonly flightService: FlightService,
        private readonly aircraftService: AircraftService,
        private readonly routerService: RouterService,
    ) {}

    @ViewChild('departureAirfieldSearchInput') departureAirfieldSearchInput!: ElementRef;
    @ViewChild('arrivalAirfieldSearchInput') arrivalAirfieldSearchInput!: ElementRef;
    @ViewChild('aircraftSearchInput') aircraftSearchInput!: ElementRef;
    @ViewChild('stepsAirfieldSearchInput') stepsAirfieldSearchInput!: QueryList<ElementRef>

    map: mapboxgl.Map | undefined;
    //style = 'mapbox://styles/mapbox/standard';
    style = environment.mapboxStyle;

    markersObstacles: mapboxgl.Marker[] = [];
    markersAirfields: mapboxgl.Marker[] = [];

    markerDepartureAirfield?: mapboxgl.Marker;
    markerArrivalAirfield?: mapboxgl.Marker;
    markersSteps?: mapboxgl.Marker[] = [];

    isLoading: boolean = true;
    isMapObjetsLoaded: boolean = false;
    isObstacleShown = true;

    isAircraftChoiceOpen: boolean = false;
    isShowFlightList: boolean = false;
    isNavlogOpen: boolean = false;
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
        setTimeout(() => {
            this.map = new mapboxgl.Map({
                accessToken: environment.mapboxToken,
                container: "map",
                style: this.style,
                zoom: 10,
                minZoom: 5,
                maxZoom: 13,
                dragRotate: false,
                keyboard: false,
                logoPosition: 'bottom-right',
                config: {
                    basemap: {
                        showPlaceLabels: true,
                        showTransitLabels: false,
                        showRoadLabels: false,
                        showBuildingModels: false,
                        showPointOfInterestLabels: false,
                    }
                }
            });

            this.map?.loadImage('assets/arrow.png',
                (error, image) => {
                    if(error) throw error;
                    if(image){
                        this.map?.addImage('arrow', image);
                    }
                });

            this.handleMapLoad();

        }, 5);

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
        this.isLoading = false;
        const subscription = this.flightService.getCurrentUserFlight().pipe(take(1000)).subscribe(
            (flight: Flight) => {
                this.currentFlight = flight;
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

    handleMapLoad(){
        this.userService.retrieveFavoriteAirfield().subscribe((airfield: AirfieldShort) => {
            this.map!.setCenter([airfield.longitude, airfield.latitude]);
        });

        this.airfieldService.retrieveAllAirfields().subscribe((airfields: Airfield[]) => {
            this.markersAirfields = airfields.map((airfield: Airfield) => {
                const elt = document.createElement('div');
                elt.className = 'marker'
                elt.style.backgroundImage = `url(${getIconAirfield(airfield.type)})`;
                elt.style.width = '35px';
                elt.style.height = '35px';
                elt.style.backgroundSize = '100%';
                elt.style.backgroundRepeat = 'no-repeat';

                const marker = new mapboxgl.Marker(elt)
                    .setLngLat([airfield.longitude, airfield.latitude])

                if(airfield.type === AirfieldType.CIVIL_PAVED || airfield.type === AirfieldType.CIVIL_UNPAVED){
                    elt.addEventListener('click', () => this.handleAirfieldClick(airfield));
                }
                return marker;
            });
            this.updateMarkersAirfields();
        });

        this.obstacleService.retrieveObstacles().subscribe((obstacles: Obstacle[]) => {
            this.markersObstacles = obstacles.map((obstacle: Obstacle) => {
                const elt = document.createElement('div');
                elt.className = 'marker'
                elt.style.backgroundImage = `url(${getIconObstacle(obstacle.type)})`;
                elt.style.width = '25px';
                elt.style.height = '35px';
                elt.style.backgroundSize = '100%';
                elt.style.backgroundRepeat = 'no-repeat';

                return new mapboxgl.Marker(elt)
                    .setLngLat([obstacle.longitude, obstacle.latitude])
            });

            this.updateMarkersObstacles();
        });

        this.map!.on('move', () => {
            this.updateMarkersObstacles();
            this.updateMarkersAirfields();
        });
        this.isMapObjetsLoaded = true;
    }

    updateMarkersAirfields() {
        const zoom = this.map!.getZoom();
        const bounds = this.map!.getBounds();

        if(zoom && zoom < 6){
            this.markersAirfields.forEach(marker => {
                marker.addTo(this.map!);
            });
        }else if(bounds){
            this.markersAirfields.forEach(marker => {
                const lngLat = marker.getLngLat();
                if (lngLat && bounds.contains([lngLat.lng, lngLat.lat])) {
                    marker.addTo(this.map!);
                } else {
                    marker.remove();
                }
            });
        }
    }

    updateMarkersObstacles() {
        const bounds = this.map!.getBounds();
        const zoom = this.map!.getZoom();

        this.markersObstacles.forEach(marker => {
            if (this.isObstacleShown && zoom >= 10 && bounds && bounds.contains(marker.getLngLat())) {
                marker.addTo(this.map!);
            } else {
                marker.remove();
            }
        });
    }

    toggleObstacleVisibility() {
        this.isObstacleShown = !this.isObstacleShown;
        this.updateMarkersObstacles();
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
            if (this.map!.getSource('flightPath')) {
                this.map!.removeLayer('directions');
                this.map!.removeLayer('flightPath');
                this.map!.removeSource('flightPath');
            }

            const path = this.currentFlight?.steps?.map(step => [step.airfield.longitude, step.airfield.latitude]) || [];

            this.map?.addSource('flightPath', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: path
                    }
                }
            });

            this.map?.addLayer({
                id: 'flightPath',
                type: 'line',
                source: 'flightPath',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#2962FF',
                    'line-width': 6
                }
            });

            this.map?.addLayer({
                id: 'directions',
                type: 'symbol',
                source: 'flightPath',
                layout: {
                    'symbol-placement': 'line',
                    'icon-image': 'arrow',
                    'icon-size': 0.06,
                    'icon-rotate': 0,
                    'icon-allow-overlap': true,
                    'icon-ignore-placement': true,
                    "symbol-spacing": 1,
                    "symbol-avoid-edges": true,
                }
            });

            const midpoint = this.computeMidpoint(this.currentFlight?.steps!);
            this.centerMapOnCurrentFlight(midpoint, this.currentFlight?.steps!);
            this.addAirfieldsMarker(this.currentFlight?.steps);
        }, 1000);
    }

    addAirfieldsMarker(steps: Step[] | undefined) {
        this.markerDepartureAirfield?.remove();
        this.markerArrivalAirfield?.remove();
        this.markersSteps?.forEach(marker => marker.remove());
        this.markersSteps = [];
        let rotationDeparture = 23;
        let rotationArrival = -23;
        let flipArrival = false;
        let marginArrival = '-10px';

        if (steps?.at(0)!.airfield.code === steps?.at(steps.length - 1)!.airfield.code) {
            flipArrival = true;
        }

        if (steps?.at(0)!.airfield.code != steps?.at(steps.length - 1)!.airfield.code) {
            rotationDeparture = 0;
            rotationArrival = 0;
            marginArrival = '8px';
        }

        const createMarker = (lng: number, lat: number, color: string, rotation: number, flip: boolean, margin: string) => {
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.width = '30px';
            el.style.height = '30px';
            el.style.marginLeft = margin;
            el.style.marginTop = '5px';
            el.style.zIndex = '1';

            const transformStyle = flip ? `rotate(${rotation}deg) scaleX(-1)` : `rotate(${rotation}deg)`;

            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="${color}" style="transform: ${transformStyle};">
                    <path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Z"/>
                </svg>
            `;
            el.innerHTML = svg;
            return new mapboxgl.Marker(el, { anchor: 'bottom' })
                .setLngLat([lng, lat])
                .addTo(this.map!);
        };

        this.markerDepartureAirfield = createMarker(
            steps!.at(0)!.airfield.longitude,
            steps!.at(0)!.airfield.latitude,
            '#22c55e',
            rotationDeparture,
            false,
            '8px'
        );

        this.markerArrivalAirfield = createMarker(
            steps!.at(steps!.length - 1)!.airfield.longitude,
            steps!.at(steps!.length - 1)!.airfield.latitude,
            '#ef4444',
            rotationArrival,
            flipArrival,
            marginArrival
        );
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

    centerMapOnCurrentFlight(midpoint: {lat: number, lng: number}, steps: Step[]) {
        if (steps.at(0)!.airfield.code === steps.at(steps.length - 1)?.airfield.code && steps.length === 2) {
            this.map!.setZoom(10);
            this.map!.setCenter([steps.at(0)!.airfield.longitude, steps.at(0)!.airfield.latitude]);
        } else {
            this.map!.setCenter([midpoint.lng, midpoint.lat]);

            const bounds = new mapboxgl.LngLatBounds();
            const margin = 0.05;

            steps.forEach(step => {
                bounds.extend([step.airfield.longitude - margin, step.airfield.latitude - margin]);
                bounds.extend([step.airfield.longitude + margin, step.airfield.latitude + margin]);
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

    toggleStepChoice(step: Step, $event?: MouseEvent) {

        this.isStepChoiceOpen[step.order-1] = !this.isStepChoiceOpen[step.order-1];
        this.resetStepChoiceOpen(step.order-1);
        this.searchTermAirfield = '';
        this.filteredAirfields = this.resetFilteredAirfields;

        if (this.isStepChoiceOpen[step.order-1]) {
            setTimeout(() => {
                if($event){
                    const target = $event?.target as HTMLElement;
                    const rect = target.getBoundingClientRect();
                    document.getElementById('selector-step-'+step.order)!.style.top = `${rect.bottom - 74 }px`;
                }
                document.getElementById('input-step-'+step.order)!.focus()
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
        const sub = this.flightService.changeStepOrder(previousOrder, currentOrder).subscribe(
            (flight: Flight) => {
                this.currentFlight = flight;
                this.drawLineBetweenAirfields();
            }
        );
        if(sub){
            this.subscription.push(sub);
        }

    }

    deleteFlight(flightId: number) {
        const sub = this.flightService.deleteFlight(flightId).subscribe(
            () => {
                this.toggleShowFlightList();
                this.loadCurrentFlight();
                this.drawLineBetweenAirfields();
            }
        );
        if(sub){
            this.subscription.push(sub);
        }
    }

    toggleNavlog() {
        this.isNavlogOpen = !this.isNavlogOpen;
    }
}
