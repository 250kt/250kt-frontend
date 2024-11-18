import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {AirfieldWeather} from "../shared/model/weather";

@Injectable({
    providedIn: 'root'
})
export class WeatherService {

    constructor(
        private readonly http: HttpClient,
    ) {}

    private readonly url = environment.backendUrl + '/weather';

    getAirfieldWeather(airfieldCode: string): Observable<AirfieldWeather> {
        return this.http.get<AirfieldWeather>(this.url + '/' + airfieldCode);
    }

}
