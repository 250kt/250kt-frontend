import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Flight} from "../shared/model/flight";
import {Observable} from "rxjs";
import {Aircraft} from "../shared/model/aircraft";
import {Airfield} from "../shared/model/airfield";
import {Step} from "../shared/model/step";

@Injectable({
    providedIn: 'root'
})
export class FlightService {

    constructor(
        private readonly http: HttpClient,
    ) {}

    private readonly url = environment.backendUrl + '/flight';

    createFlight(): Observable<Flight>{
        return this.http.post(this.url,{});
    }

    getCurrentUserFlight(): Observable<Flight>{
        return this.http.get<Flight>(`${this.url}/current`);
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

    changeStepAirfield(step: Step, airfield: Airfield) : Observable<Flight>{
        return this.http.put(`${this.url}/step/${step.id}/airfield`, airfield);
    }

    addStep(): Observable<Flight>{
        return this.http.post(`${this.url}/step`, {});
    }

    removeStep(step: Step): Observable<Flight> {
        return this.http.delete(`${this.url}/step/${step.id}`);
    }

    changeStepOrder(previousOrder: number, currentOrder: number) {
        return this.http.put(`${this.url}/step/order/${previousOrder}/${currentOrder}`, {});
    }

    deleteFlight(flightId: number) {
        return this.http.delete(`${this.url}/${flightId}`);
    }
}
