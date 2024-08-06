import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Flight} from "../shared/model/flight";
import {Observable} from "rxjs";
import {Aircraft} from "../shared/model/aircraft";
import {Airfield} from "../shared/model/airfield";

@Injectable({
    providedIn: 'root'
})
export class FlightService {

    constructor(
        private readonly http: HttpClient,
    ) {}

    private url = environment.backendUrl + '/flight';

    createFlight(): Observable<Flight>{
        return this.http.post(this.url,{});
    }

    getCurrentUserFlight(): Observable<Flight>{
        return this.http.get<Flight>(`${this.url}/current`);
    }

    updateFlight(flight: Flight) : Observable<Flight>{
        return this.http.put<Flight>(`${this.url}`, flight);
    }

    getUserFlights(){
        return this.http.get<Flight[]>(this.url);
    }

    changeCurrentFlight(flight: Flight): Observable<Flight>{
        return this.http.put(`${this.url}/current`, flight);
    }

    changeAircraft(aircraft: Aircraft): Observable<Flight>{
        return this.http.put(`${this.url}/aircraft`, aircraft);
    }

    changeDepartureAirfield(airfield: Airfield): Observable<Flight>{
        return this.http.put(`${this.url}/airfield/departure`, airfield);
    }

    changeArrivalAirfield(airfield: Airfield): Observable<Flight>{
        return this.http.put(`${this.url}/airfield/arrival`, airfield);
    }
}
