    import {Component, OnInit} from '@angular/core';
import {GoogleMap, MapAdvancedMarker, MapMarker} from "@angular/google-maps";
import {ObstacleService} from '../service/obstacle.service';
import {getIconObstacle, Obstacle} from "../shared/model/obstacle";
import {AsyncPipe} from "@angular/common";
import {UserService} from "../service/user.service";
import {Airfield, getIconAirfield} from '../shared/model/airfield';
import {AirfieldService} from "../service/airfield.service";
import {AirspaceService} from "../service/airspace.service";

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
    polygonsAirspaces: google.maps.Polygon[] = [];

    constructor(
        private readonly obstacleService: ObstacleService,
        private readonly userService: UserService,
        private readonly airfieldService: AirfieldService,
        private readonly airspaceService: AirspaceService,
    ) {}

    ngOnInit() {}

    handleMapLoad(map: google.maps.Map) {
        this.userService.retrieveFavoriteAirfield().subscribe((airfield: Airfield) => {
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
                        anchor: new google.maps.Point(12.5, 17.5),
                    }
                });
            });

            this.updateMarkersObstacles(map);
        });

        this.airspaceService.retrieveAirspaces().subscribe((airspaces) => {
            this.polygonsAirspaces = airspaces
                //TODO: Do the filtering in the backend
                .filter(airspace => airspace.id == 304352)
                .filter(airspace => airspace.part.length > 0)
                .filter(airspace => airspace.type == 'CTR' || airspace.type == 'CTL' || airspace.type == 'TMA' || airspace.type == 'ATZ' || airspace.type == 'FIR'  || airspace.type == "SIV" || airspace.type == 'ZIT' || airspace.type == 'D' || airspace.type == 'P' || airspace.type == 'R' || airspace.type == 'ZRT' || airspace.type == 'TMA' || airspace.type == 'PRN' || airspace.type == 'SUR' || airspace.type == 'TMA' || airspace.type == 'NAV' || airspace.type == 'S/CTR' || airspace.type == 'S/CTA' || airspace.type == 'UIR' || airspace.type == 'LTA')
                .map((airspace) => {
                return new google.maps.Polygon({
                    //TODO: Do the splitting in the backend
                    paths: airspace.part[0].geometry.split('\n').map((point) => {
                        const [lat, lng] = point.split(',');
                        return {lat: parseFloat(lat), lng: parseFloat(lng)};
                    }),
                    strokeColor: this.getAirSpaceColor(airspace.type),
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    map: map,
                    fillOpacity: 0,
                    clickable: true
                });
            });
            this.updatePolygonsAirspaces(map);
        });

        map.addListener('bounds_changed', () => {
            this.updateMarkersObstacles(map);
            this.updateMarkersAirfields(map);
            this.updatePolygonsAirspaces(map);
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

        if(zoom && zoom < 10){
            this.markersObstacles.forEach(marker => {
                marker.setMap(null);
            });
        } else if(bounds) {
            this.markersObstacles.forEach(marker => {
                if (bounds.contains(marker.getPosition()!)) {
                    marker.setMap(map);
                } else {
                    marker.setMap(null);
                }
            });
        }
    }

    updatePolygonsAirspaces(map: google.maps.Map) {
        const zoom = map.getZoom();
        const bounds = map.getBounds();

        if(zoom && zoom < 6){
            this.polygonsAirspaces.forEach(polygon => {
                polygon.setMap(null);
            });
        }else{
            if(bounds){
                this.polygonsAirspaces.forEach(polygon => {
                    let isInBounds = false;
                    for (let i = 0; i < polygon.getPath().getLength(); i++) {
                        if (bounds.contains(polygon.getPath().getAt(i))) {
                            isInBounds = true;
                            break;
                        }
                    }
                    if (isInBounds) {
                        polygon.setMap(map);
                    } else {
                        polygon.setMap(null);
                    }
                });
            }
        }
    }

    getAirSpaceColor(type: string): string {
        switch (type) {
            case 'CTR':
                return 'blue';
            case 'TMA':
                return 'red';
            case 'SIV':
                return 'green';
            case 'D':
                return 'red';
            case 'R':
                return 'red';
            case 'P':
                return 'red';
            default:
                return 'grey';
        }
    }

}
