import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Aircraft} from "../shared/model/aircraft";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AircraftService {

    constructor(
        private readonly http: HttpClient,
    ) {}

    private readonly url = environment.backendUrl + '/aircraft';

    createAircraft(aircraft: Aircraft) {
        return this.http.post(this.url, aircraft);
    }

    retrieveUserAircrafts(): Observable<Aircraft[]> {
        return this.http.get<Aircraft[]>(`${this.url}/user-aircrafts`);
    }

    updateAircraft(aircraft: Aircraft) {
        return this.http.put(this.url, aircraft);
    }

    deleteAircraft(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }

    updateFavoriteAircraft(aircraft: Aircraft) {
        return this.http.put(`${this.url}/favorite`, aircraft);
    }
}
