import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Aircraft} from "../shared/model/aircraft";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AircraftService {

    constructor(
        private readonly http: HttpClient,
    ) {}

    private url = environment.backendUrl + '/aircraft';

    createAircraft(aircraft: Aircraft, token: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.http.post(this.url, aircraft, {headers:headers});
    }
}
