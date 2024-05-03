import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
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

    private url = environment.backendUrl + '/aircraft';

    createAircraft(aircraft: Aircraft, token: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.http.post(this.url, aircraft, {headers:headers});
    }

    retrieveUserAircrafts(token: string): Observable<Aircraft[]> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<Aircraft[]>(`${this.url}/user-aircrafts`, {headers:headers});
    }

    updateAircraft(aircraft: Aircraft, token: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.http.put(this.url, aircraft, {headers: headers});
    }

    deleteAircraft(id: number, token: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.http.delete(`${this.url}/${id}`, {headers: headers});
    }
}
