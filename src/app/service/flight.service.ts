import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Flight} from "../shared/model/flight";

@Injectable({
    providedIn: 'root'
})
export class FlightService {

    constructor(
        private readonly http: HttpClient,
    ) {}

    private url = environment.backendUrl + '/flight';

    createFlight(flight: Flight){
        return this.http.post(this.url, flight);
    }

    getCurrentUserFlight(){
        return this.http.get<Flight>(this.url);
    }

    updateFlight(flight: Flight){
        return this.http.put(`${this.url}`, flight);
    }

}
