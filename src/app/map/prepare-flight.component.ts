import {Component, OnInit} from '@angular/core';
import {ObstacleService} from '../service/obstacle.service';
import {getIconObstacle, Obstacle} from "../shared/model/obstacle";
import {UserService} from "../service/user.service";
import {Airfield, AirfieldShort, getIconAirfield} from '../shared/model/airfield';
import {AirfieldService} from "../service/airfield.service";

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

    isObstacleShown = true;
    map?: google.maps.Map;

    constructor(
        private readonly obstacleService: ObstacleService,
        private readonly userService: UserService,
        private readonly airfieldService: AirfieldService
    ) {}

    ngOnInit() {}

    handleMapLoad(map: google.maps.Map) {
        this.map = map;
        this.userService.retrieveFavoriteAirfield().subscribe((airfield: AirfieldShort) => {
            map.setCenter({lat: airfield.latitude, lng: airfield.longitude});
        });

        this.airfieldService.retrieveAllAirfields().subscribe((airfields: Airfield[]) => {
            this.markersAirfields = airfields.map((airfield: Airfield) => {
                return new google.maps.Marker({
                    position: {lat: airfield.latitude, lng: airfield.longitude},
                    title: airfield.fullName,
                    icon: {
                        url: getIconAirfield(airfield.type),
                        scaledSize: new google.maps.Size(35, 35),
                        anchor: new google.maps.Point(17.5, 17.5),
                    },

                });
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
                    }
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
}
