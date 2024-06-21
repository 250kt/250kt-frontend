import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Airspace} from "../shared/model/airspace";

@Injectable({
    providedIn: 'root'
})
export class AirspaceService {

    constructor(
        private readonly http: HttpClient,
    ) {}

    private url = environment.backendUrl + '/airspace';

    retrieveAirspaces(): Observable<Airspace[]> {
        return this.http.get<Airspace[]>(`${this.url}/all`);
    }
}
