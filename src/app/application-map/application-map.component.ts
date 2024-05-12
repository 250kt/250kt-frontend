import {Component, OnInit} from '@angular/core';
import {GoogleMap, MapAdvancedMarker, MapMarker} from "@angular/google-maps";
import {ObstacleService} from '../service/obstacle.service';
import {getIconUrl, Obstacle} from "../shared/model/obstacle";
import {AsyncPipe} from "@angular/common";
import {Observable} from "rxjs";

@Component({
    selector: 'app-application-map',
    standalone: true,
    imports: [
        GoogleMap,
        MapMarker,
        AsyncPipe,
        MapAdvancedMarker
    ],
    templateUrl: './application-map.component.html',
})
export class ApplicationMapComponent implements OnInit {
    options: google.maps.MapOptions = {
        center: {lat: 49, lng: 3}, //Center on favorite user's airport
        zoom: 9,
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
    obstacles$: Observable<Obstacle[]> | undefined
    markers: google.maps.Marker[] = [];

    constructor(
        private readonly obstacleService: ObstacleService
    ) {}

    ngOnInit() {
        this.obstacles$ = this.obstacleService.retrieveObstacles();
    }

    handleMapLoad(map: google.maps.Map) {
        this.obstacleService.retrieveObstacles().subscribe((obstacles: Obstacle[]) => {
            this.markers = obstacles.map((obstacle: Obstacle) => {
                const icon = getIconUrl(obstacle.type);
                return new google.maps.Marker({
                    position: {lat: obstacle.latitude, lng: obstacle.longitude},
                    title: obstacle.id + ' ' + obstacle.type,
                    icon: {
                        url: icon,
                        scaledSize: new google.maps.Size(25, 35),
                    }
                });
            });

            this.updateMarkers(map);
        });

        map.addListener('bounds_changed', () => {
            this.updateMarkers(map);
        });
    }

    updateMarkers(map: google.maps.Map) {
        const bounds = map.getBounds();
        const zoom = map.getZoom();

        if(zoom && zoom < 10){
            this.markers.forEach(marker => {
                marker.setMap(null);
            });
        } else if(bounds) {
            this.markers.forEach(marker => {
                if (bounds.contains(marker.getPosition()!)) {
                    marker.setMap(map);
                } else {
                    marker.setMap(null);
                }
            });
        }
    }

}
