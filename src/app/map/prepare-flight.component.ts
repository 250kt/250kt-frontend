import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ObstacleService} from '../service/obstacle.service';
import {getIconObstacle, Obstacle} from "../shared/model/obstacle";
import {UserService} from "../service/user.service";
import {Airfield, AirfieldShort, AirfieldType, getIconAirfield} from '../shared/model/airfield';
import {AirfieldService} from "../service/airfield.service";
import {FlightService} from "../service/flight.service";
import {Flight} from "../shared/model/flight";
import {delay} from "rxjs";

@Component({
    selector: 'prepare-flight',
    templateUrl: './prepare-flight.component.html',
})
export class PrepareFlightComponent implements OnInit {

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
    map?: google.maps.Map;

    selectedAirfield?: Airfield;
    currentFlight?: Flight;

    isLoading: boolean = true;
    isObstacleShown = true;

    isMapLoaded = false;

    constructor(
        private readonly obstacleService: ObstacleService,
        private readonly userService: UserService,
        private readonly airfieldService: AirfieldService,
        private cdr: ChangeDetectorRef,
        private readonly flightService: FlightService,
    ) {}

    ngOnInit() {
        this.flightService.getCurrentUserFlight()
            .pipe(delay(1000))
            .subscribe((flight: Flight) => {
            this.currentFlight = flight;
            this.isLoading = false;
            this.cdr.detectChanges();
        });
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

    loadCurrentFlight(flight: Flight) {
        this.currentFlight = flight;
        this.drawLineBetweenAirfields();
        this.cdr.detectChanges();
    }

    drawLineBetweenAirfields() {
        setTimeout(() => {
            this.flightPath?.setMap(null);

            if (this.currentFlight?.airfieldDeparture && this.currentFlight?.airfieldArrival) {
                this.flightPath = new google.maps.Polyline({
                    map: this.map,
                    path: [
                        {lat: this.currentFlight.airfieldDeparture.latitude, lng: this.currentFlight.airfieldDeparture.longitude},
                        {lat: this.currentFlight.airfieldArrival.latitude, lng: this.currentFlight.airfieldArrival.longitude},
                    ],
                    geodesic: false,
                    strokeColor: '#2962FF',
                    strokeOpacity: 1.0,
                    strokeWeight: 6,
                });
                const midpoint = {
                    lat: (this.currentFlight.airfieldDeparture.latitude + this.currentFlight.airfieldArrival.latitude) / 2,
                    lng: (this.currentFlight.airfieldDeparture.longitude + this.currentFlight.airfieldArrival.longitude) / 2,
                };

                this.centerMapOnCurrentFlight(this.currentFlight.airfieldDeparture, this.currentFlight.airfieldArrival, midpoint);
            }
        }, 1000)
    }

    centerMapOnCurrentFlight(airfieldDeparture: Airfield, airfieldArrival: Airfield, midpoint: {lat: number, lng: number}) {
        if(airfieldDeparture.code === airfieldArrival.code){
            this.map!.setZoom(10);
            this.map!.setCenter({lat: airfieldDeparture.latitude, lng: airfieldDeparture.longitude});
        }else{


            this.map!.setCenter(midpoint);

            const bounds = new google.maps.LatLngBounds();
            bounds.extend({lat: airfieldDeparture.latitude, lng: airfieldDeparture.longitude});
            bounds.extend({lat: airfieldArrival.latitude, lng: airfieldArrival.longitude});

            this.map!.fitBounds(bounds);
        }
    }
}
