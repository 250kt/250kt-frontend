import {Component, OnInit} from '@angular/core';
import {GoogleMap} from "@angular/google-maps";

@Component({
    selector: 'app-application-map',
    standalone: true,
    imports: [
        GoogleMap
    ],
    templateUrl: './application-map.component.html',
})
export class ApplicationMapComponent implements OnInit {
    options: google.maps.MapOptions = {
        center: {lat: 49, lng: 3},
        zoom: 8,
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
    constructor() {}

    ngOnInit() {}

}
