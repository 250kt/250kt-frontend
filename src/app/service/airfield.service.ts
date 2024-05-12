import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Airfield} from "../shared/model/airfield";

@Injectable({
    providedIn: 'root'
})
export class AirfieldService {

    constructor(
        private readonly http: HttpClient,
    ) {}

    private url = environment.backendUrl + '/airfield';

    retrieveAllAirfields(): Observable<Airfield[]> {
        return this.http.get<Airfield[]>(`${this.url}/all`);
    }
}
